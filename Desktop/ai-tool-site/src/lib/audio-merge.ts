// Audio merging utilities for multi-speaker dialogue.
// Concatenates per-speaker TTS blobs into a single WAV file using the Web Audio API.

/** Small pause (in seconds) inserted between consecutive speaker segments. */
const SEGMENT_GAP_SECONDS = 0.15;

function writeString(view: DataView, offset: number, str: string): void {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}

/** Convert a rendered AudioBuffer into a 16-bit PCM WAV blob. */
export function audioBufferToWavBlob(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const numFrames = buffer.length;
  const bytesPerSample = 2;
  const blockAlign = numChannels * bytesPerSample;
  const dataSize = numFrames * blockAlign;
  const arrayBuffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(arrayBuffer);

  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true); // PCM chunk size
  view.setUint16(20, 1, true); // PCM format
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true); // bits per sample
  writeString(view, 36, "data");
  view.setUint32(40, dataSize, true);

  // Interleave channels
  const channelData: Float32Array[] = [];
  for (let ch = 0; ch < numChannels; ch++) {
    channelData.push(buffer.getChannelData(ch));
  }
  let offset = 44;
  for (let i = 0; i < numFrames; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      const sample = Math.max(-1, Math.min(1, channelData[ch][i]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      offset += 2;
    }
  }

  return new Blob([arrayBuffer], { type: "audio/wav" });
}

function copyBufferToTarget(
  source: AudioBuffer,
  target: AudioBuffer,
  offset: number
): void {
  const channels = Math.min(source.numberOfChannels, target.numberOfChannels);
  for (let ch = 0; ch < channels; ch++) {
    target.copyToChannel(source.getChannelData(ch), ch, offset);
  }
}

/**
 * Merge multiple audio blobs (MP3/WAV/etc.) into a single WAV blob,
 * concatenated back-to-back with a short pause between segments.
 */
export async function mergeAudioBlobs(blobs: Blob[]): Promise<Blob> {
  const valid = blobs.filter((b) => b && b.size > 0);
  if (valid.length === 0) {
    throw new Error("No audio segments to merge");
  }
  if (valid.length === 1) {
    return valid[0];
  }

  // Uniform decode target — TTS returns 16kHz/24kHz mono; resample everything
  // to a single consistent rate so concatenation is seamless.
  const decodeRate = 24000;
  const decodeCtx = new OfflineAudioContext(2, 1, decodeRate);

  const decode = async (blob: Blob): Promise<AudioBuffer> => {
    const arrayBuffer = await blob.arrayBuffer();
    return decodeCtx.decodeAudioData(arrayBuffer);
  };

  const buffers = await Promise.all(valid.map(decode));

  const channels = Math.max(...buffers.map((b) => b.numberOfChannels));
  const sampleRate = buffers[0].sampleRate;
  const gapSamples = Math.floor(sampleRate * SEGMENT_GAP_SECONDS);
  const totalSamples =
    buffers.reduce((acc, b) => acc + b.length, 0) +
    gapSamples * Math.max(0, buffers.length - 1);

  const offline = new OfflineAudioContext(channels, totalSamples, sampleRate);
  // NOTE: AudioBufferSourceNode.start() 的第一个参数是「秒」，不是帧数。
  // 之前误把帧数 offset 直接传入，导致第二段以后的音频被排到渲染范围外而丢失。
  let offset = 0;
  for (const buffer of buffers) {
    const source = offline.createBufferSource();
    source.buffer = buffer;
    source.connect(offline.destination);
    source.start(offset / sampleRate);
    offset += buffer.length + gapSamples;
  }

  const rendered = await offline.startRendering();
  return audioBufferToWavBlob(rendered);
}
