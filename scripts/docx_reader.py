#!/usr/bin/env python3
"""
DOCX Helper Utility:
Allows parsing and extracting structured text, headings, and tables from .docx files without external dependencies.
"""

import sys
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

NAMESPACES = {
    'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
}

def parse_docx(file_path: str) -> str:
    path = Path(file_path)
    if not path.exists():
        return f"Error: File '{file_path}' does not exist."

    try:
        with zipfile.ZipFile(path) as docx:
            xml_content = docx.read('word/document.xml')
            tree = ET.fromstring(xml_content)
            
            output_lines = []
            
            # Find all paragraphs and tables in order
            body = tree.find('w:body', NAMESPACES)
            if body is None:
                return "Error: Empty Word document body."

            for child in body:
                tag = child.tag.split('}')[-1]
                
                # Paragraph
                if tag == 'p':
                    # Check paragraph style (Heading vs Normal)
                    style_elem = child.find('.//w:pStyle', NAMESPACES)
                    style_val = style_elem.attrib.get(f"{{{NAMESPACES['w']}}}val") if style_elem is not None else ""
                    
                    texts = [t.text for t in child.findall('.//w:t', NAMESPACES) if t.text]
                    full_text = "".join(texts).strip()
                    
                    if full_text:
                        if 'Heading' in style_val or 'Judul' in style_val:
                            output_lines.append(f"\n### {full_text}\n")
                        else:
                            output_lines.append(full_text)
                
                # Table
                elif tag == 'tbl':
                    output_lines.append("\n[Table]")
                    rows = child.findall('.//w:tr', NAMESPACES)
                    for row in rows:
                        cells = row.findall('.//w:tc', NAMESPACES)
                        cell_texts = []
                        for cell in cells:
                            ctexts = [t.text for t in cell.findall('.//w:t', NAMESPACES) if t.text]
                            cell_texts.append(" ".join(ctexts).strip())
                        output_lines.append(" | ".join(cell_texts))
                    output_lines.append("[/Table]\n")

            return "\n\n".join(output_lines)
    except Exception as e:
        return f"Error parsing docx: {str(e)}"

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 docx_reader.py <path_to_docx>")
        sys.exit(1)
    
    print(parse_docx(sys.argv[1]))
