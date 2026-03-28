"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const collaborationTypes = [
  { value: "", label: "请选择合作类型" },
  { value: "prototype", label: "AI 原型 / MVP（2–4 周）" },
  { value: "consulting", label: "企业 AI 咨询与路线图" },
  { value: "analytics", label: "数据与增长分析" },
  { value: "other", label: "其他 / 先聊聊" },
] as const;

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [collab, setCollab] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`[josephjwang.com] 合作意向 · ${name || "未填写姓名"}`);
    const body = encodeURIComponent(
      `姓名：${name}\n邮箱：${email}\n公司/项目：${company}\n合作类型：${collab || "未选择"}\n\n需求说明：\n${message}`
    );
    window.location.href = `mailto:hello@josephjwang.com?subject=${subject}&body=${body}`;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-slate-300">
            姓名 <span className="text-red-400">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-white/15 bg-white/5 text-white placeholder:text-slate-500"
            placeholder="您的称呼"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-300">
            工作邮箱 <span className="text-red-400">*</span>
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-white/15 bg-white/5 text-white placeholder:text-slate-500"
            placeholder="name@company.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="company" className="text-slate-300">
          公司 / 项目（选填）
        </Label>
        <Input
          id="company"
          name="company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="border-white/15 bg-white/5 text-white placeholder:text-slate-500"
          placeholder="便于我了解背景"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="collab" className="text-slate-300">
          合作类型
        </Label>
        <select
          id="collab"
          name="collab"
          value={collab}
          onChange={(e) => setCollab(e.target.value)}
          className={cn(
            "flex h-10 w-full rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm text-white",
            "outline-none focus-visible:border-cyan-500/50 focus-visible:ring-2 focus-visible:ring-cyan-500/20"
          )}
        >
          {collaborationTypes.map((opt) => (
            <option key={opt.value || "empty"} value={opt.value} className="bg-slate-950">
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="text-slate-300">
          需求说明 <span className="text-red-400">*</span>
        </Label>
        <Textarea
          id="message"
          name="message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="resize-y border-white/15 bg-white/5 text-white placeholder:text-slate-500"
          placeholder="行业、当前阶段、期望时间线、是否已有数据或 Demo 链接…"
        />
      </div>

      <p className="text-xs text-slate-500">
        提交后将打开本地邮件客户端发送邮件；若未安装邮件客户端，请直接使用页面上方邮箱联系。
      </p>

      <Button type="submit" className="w-full bg-cyan-500 text-slate-950 hover:bg-cyan-400 sm:w-auto">
        发送意向
      </Button>
    </form>
  );
}
