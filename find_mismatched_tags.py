import re

def find_mismatch():
    with open('src/pages/Admin.tsx', 'r', encoding='utf-8') as f:
        lines = f.readlines()

    tag_stack = []
    
    # We want to match tags like:
    # <div>, <table className="...">, but not self-closing tags like <Search /> or <input />
    # Also want to ignore comments, strings, etc.
    # A simple regex for tags:
    tag_re = re.compile(r'</?([a-zA-Z0-9\.:\-_]+)(?:\s+[^>]*?)?>')

    for idx, line in enumerate(lines, 1):
        clean_line = re.sub(r'{\s*/\*.*?\*/\s*}', '', line)
        clean_line = re.sub(r'//.*', '', clean_line)
        
        # Let's find all tags on this line
        matches = tag_re.finditer(clean_line)
        for m in matches:
            tag_text = m.group(0)
            tag_name = m.group(1)
            
            # Check if self-closing (ends with />)
            if tag_text.endswith('/>'):
                continue
                
            # If it's a closing tag like </div>
            if tag_text.startswith('</'):
                if tag_stack and tag_stack[-1][0] == tag_name:
                    tag_stack.pop()
                else:
                    # Mismatch or closing without opening
                    print(f"Line {idx}: Closing tag </{tag_name}> doesn't match top of stack: {tag_stack[-3:] if tag_stack else 'Empty'}")
            else:
                # Opening tag
                tag_stack.append((tag_name, idx))
        
        if idx in [2310, 2311, 2312, 2313, 2400, 2450, 2490, 2498, 2500]:
            print(f"Line {idx} tag stack: {[t[0] for t in tag_stack]}")

find_mismatch()
