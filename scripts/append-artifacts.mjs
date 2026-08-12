import fs from 'fs';
import path from 'path';

const customKnowledgeDir = 'c:\\Users\\recompra.es\\openllc-Nextjs\\knowledge\\custom';
const artifactsDir = 'C:\\Users\\recompra.es\\.gemini\\antigravity-ide\\brain\\6bfa026d-ff04-4bc1-9bdb-816530a76499';

const q51_q100_path = path.join(artifactsDir, 'q51_q100_knowledge.md');
const q101_q150_path = path.join(artifactsDir, 'q101_q150_knowledge.md');

// Helper to append content
function appendContent(artifactPath, startIdx, endIdx) {
    if (!fs.existsSync(artifactPath)) {
        console.error(`Artifact not found: ${artifactPath}`);
        return;
    }
    
    let appendedContent = '\n\n---\n\n## Preguntas y Respuestas Completas\n\n';
    
    for (let i = startIdx; i <= endIdx; i++) {
        // Find the file that matches the prefix q{i}-
        const files = fs.readdirSync(customKnowledgeDir);
        const file = files.find(f => f.startsWith(`q${i}-`) && f.endsWith('.md'));
        if (file) {
            const filePath = path.join(customKnowledgeDir, file);
            const content = fs.readFileSync(filePath, 'utf-8');
            appendedContent += `\n\n${content}\n\n---\n`;
        } else {
            console.warn(`Could not find file for Q${i}`);
        }
    }
    
    fs.appendFileSync(artifactPath, appendedContent);
    console.log(`Successfully appended content to ${artifactPath}`);
}

appendContent(q51_q100_path, 51, 100);
appendContent(q101_q150_path, 101, 150);
