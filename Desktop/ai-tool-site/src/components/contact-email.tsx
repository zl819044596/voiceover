"use client";

import { useEffect, useState } from "react";

/**
 * 邮箱地址组件：客户端 useEffect 动态拼接。
 * 避免 SSG 静态 HTML 中出现完整邮箱 → Cloudflare Email Obfuscation
 * 不会把它替换成 /cdn-cgi/l/email-protection 混淆链接（该路径被爬虫/监控
 * 工具抓取返回 404，污染监控数据）。
 */
const LOCAL = "zl18672545321";
const DOMAIN = "gmail.com";

export function ContactEmail({
  className,
}: {
  className?: string;
}) {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    setEmail(`${LOCAL}@${DOMAIN}`);
  }, []);

  if (!email) {
    return <span className={className}>support email</span>;
  }

  return (
    <a href={`mailto:${email}`} className={className}>
      {email}
    </a>
  );
}
