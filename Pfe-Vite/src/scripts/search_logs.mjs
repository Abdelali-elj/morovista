import fs from 'fs';
import readline from 'readline';

async function extractLastVersions() {
    const logPath = 'C:\\Users\\HP\\.gemini\\antigravity-ide\\brain\\f306c8df-ec87-4e24-bb85-91d77b38d3f7\\.system_generated\\logs\\transcript.jsonl';
    const fileStream = fs.createReadStream(logPath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let lastPlansJSX = null;
    let lastPlansCSS = null;

    for await (const line of rl) {
        try {
            const data = JSON.parse(line);
            const step = data.step_index || 0;
            
            const toolCalls = data.tool_calls || [];
            for (const call of toolCalls) {
                const args = call.args || {};
                const targetFile = args.TargetFile || args.AbsolutePath || "";
                const codeContent = args.CodeContent || "";
                
                if (targetFile.includes('PlansG.jsx') && codeContent && codeContent.length > 200) {
                    lastPlansJSX = { step, content: codeContent };
                }
                if (targetFile.includes('plans.css') && codeContent && codeContent.length > 200) {
                    lastPlansCSS = { step, content: codeContent };
                }
            }
        } catch (e) {}
    }

    if (lastPlansJSX) {
        // Remove outer quotes and unescape
        let raw = lastPlansJSX.content;
        if (raw.startsWith('"')) raw = raw.slice(1);
        if (raw.endsWith('"')) raw = raw.slice(0, -1);
        // Unescape
        raw = raw
            .replace(/\\n/g, '\n')
            .replace(/\\t/g, '\t')
            .replace(/\\"/g, '"')
            .replace(/\\\\/g, '\\')
            .replace(/\\r/g, '');
        fs.writeFileSync('C:\\Users\\HP\\.gemini\\antigravity-ide\\brain\\f306c8df-ec87-4e24-bb85-91d77b38d3f7\\restored_PlansG.jsx', raw);
        console.log(`Restored PlansG.jsx from step ${lastPlansJSX.step} (${raw.length} bytes)`);
    }

    if (lastPlansCSS) {
        let raw = lastPlansCSS.content;
        if (raw.startsWith('"')) raw = raw.slice(1);
        if (raw.endsWith('"')) raw = raw.slice(0, -1);
        raw = raw
            .replace(/\\n/g, '\n')
            .replace(/\\t/g, '\t')
            .replace(/\\"/g, '"')
            .replace(/\\\\/g, '\\')
            .replace(/\\r/g, '');
        fs.writeFileSync('C:\\Users\\HP\\.gemini\\antigravity-ide\\brain\\f306c8df-ec87-4e24-bb85-91d77b38d3f7\\restored_plans.css', raw);
        console.log(`Restored plans.css from step ${lastPlansCSS.step} (${raw.length} bytes)`);
    }
}

extractLastVersions();
