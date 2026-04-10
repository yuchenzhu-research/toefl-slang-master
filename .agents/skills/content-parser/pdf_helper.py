#!/usr/bin/env python3
"""
PDF Helper for Content Parser Skill
提取 PDF 文本并转换为笔记格式
"""

import re
import subprocess
from pathlib import Path


def extract_text_from_pdf(pdf_path: str) -> str:
    """从 PDF 中提取文本内容"""
    try:
        import pypdf
        reader = pypdf.PdfReader(pdf_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return clean_pdf_text(text)
    except ImportError:
        # 尝试使用 pdftotext 命令行工具
        return extract_with_pdftotext(pdf_path)


def extract_with_pdftotext(pdf_path: str) -> str:
    """使用 pdftotext 命令行工具提取"""
    try:
        result = subprocess.run(
            ["pdftotext", pdf_path, "-"],
            capture_output=True,
            text=True,
            timeout=30
        )
        return clean_pdf_text(result.stdout)
    except (subprocess.SubprocessError, FileNotFoundError):
        return ""


def clean_pdf_text(text: str) -> str:
    """清理 PDF 提取的原始文本"""
    if not text:
        return ""
    
    # 移除多余空行
    text = re.sub(r'\n{3,}', '\n\n', text)
    
    # 修复常见 PDF 提取问题
    text = re.sub(r'([a-z])\n([a-z])', r'\1\2', text)  # 行尾连字符
    text = re.sub(r'\s+', ' ', text)  # 多空格合并
    text = text.strip()
    
    return text


def generate_note_template(content: str, title: str = "未命名文档") -> str:
    """生成《经济学人》风格笔记模板"""
    
    # 提取俚语和短语
    slang_patterns = [
        r"\b(gonna|wanna|kinda|didn't|can't|won't|it's|that's|there's)\b",
        r"\b(awesome|cool|stuff|thing|pretty|like)\b",
    ]
    
    slang_extractions = []
    for pattern in slang_patterns:
        matches = re.findall(pattern, content, re.IGNORECASE)
        slang_extractions.extend([m.lower() for m in set(matches)])
    
    # 生成学术转换建议
    academic_transforms = {
        "gonna": [("going to", "formal")],
        "wanna": [("want to", "formal")],
        "kinda": [("somewhat", "formal"), ("rather", "formal")],
        "stuff": [("factors", "academic"), ("elements", "academic")],
        "thing": [("aspect", "academic"), ("factor", "academic")],
        "awesome": [("remarkable", "academic"), ("significant", "academic")],
        "big": [("substantial", "academic"), ("significant", "academic")],
        "get": [("obtain", "academic"), ("acquire", "academic")],
        "pretty": [("moderately", "academic"), ("considerably", "academic")],
    }
    
    transformations = []
    for slang in set(slang_extractions):
        if slang in academic_transforms:
            for trans, style in academic_transforms[slang]:
                transformations.append({
                    "slang": slang,
                    "academic": trans,
                    "style": style
                })
    
    # 构建模板
    template = f"""# 原文标题: {title}

## Section 1: Slang Extraction
| 俚语/口语表达 | 出现次数 | 建议修改 |
|---|---|---|
"""
    
    for slang in sorted(set(slang_extractions)):
        count = slang_extractions.count(slang)
        suggestions = ", ".join([t["academic"] for t in transformations if t["slang"] == slang])
        template += f"| {slang} | {count} | {suggestions} |\n"
    
    template += """
## Section 2: Academic Transformation
| 口语表达 | 学术替代表达 | 语气风格 |
|---|---|---|
"""
    
    for t in transformations:
        template += f"| {t['slang']} | {t['academic']} | {t['style']} |\n"
    
    return template


if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        pdf_path = sys.argv[1]
        text = extract_text_from_pdf(pdf_path)
        print(generate_note_template(text, Path(pdf_path).stem))
    else:
        print("用法: python pdf_helper.py <pdf文件路径>")
