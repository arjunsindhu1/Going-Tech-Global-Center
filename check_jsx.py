import re

def validate_jsx():
    with open('src/pages/Admin.tsx', 'r', encoding='utf-8') as f:
        lines = f.readlines()

    div_count = 0
    history = []

    for idx, line in enumerate(lines, 1):
        # Ignore comments
        clean_line = re.sub(r'{\s*/\*.*?\*/\s*}', '', line)
        clean_line = re.sub(r'//.*', '', clean_line)

        opens = len(re.findall(r'<div\b', clean_line))
        closes = clean_line.count('</div>')
        
        if opens > 0 or closes > 0:
            div_count += opens - closes
            history.append((idx, opens, closes, div_count, line.strip()))

    # Print the last 20 entries of history to see where things went wrong
    for h in history[-30:]:
        print(f"Line {h[0]}: opens={h[1]}, closes={h[2]}, cumulative_divs={h[3]} | {h[4][:80]}")

validate_jsx()
