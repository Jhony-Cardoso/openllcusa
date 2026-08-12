import fs from 'fs';
import path from 'path';

const customKnowledgeDir = 'c:\\Users\\recompra.es\\openllc-Nextjs\\knowledge\\custom';
const artifactsDir = 'C:\\Users\\recompra.es\\.gemini\\antigravity-ide\\brain\\6bfa026d-ff04-4bc1-9bdb-816530a76499';

const q51_q100_path = path.join(artifactsDir, 'q51_q100_knowledge.md');
const q101_q150_path = path.join(artifactsDir, 'q101_q150_knowledge.md');

function fixArtifact(artifactPath, startIdx, endIdx) {
    if (!fs.existsSync(artifactPath)) {
        console.error(`Artifact not found: ${artifactPath}`);
        return;
    }
    
    const oldContent = fs.readFileSync(artifactPath, 'utf-8');
    const separator = '\n\n---\n\n## Preguntas y Respuestas Completas\n\n';
    
    let indexPart = oldContent;
    if (oldContent.includes(separator)) {
        indexPart = oldContent.split(separator)[0];
    }
    
    let newContent = indexPart + separator;
    
    for (let i = startIdx; i <= endIdx; i++) {
        const files = fs.readdirSync(customKnowledgeDir);
        const file = files.find(f => f.startsWith(`q${i}-`) && f.endsWith('.md'));
        if (file) {
            const filePath = path.join(customKnowledgeDir, file);
            let content = fs.readFileSync(filePath, 'utf-8');
            
            // Replace the first header "# Title" with "# Q{i}: Title"
            content = content.replace(/^#\s+(.*)$/m, `# Q${i}: $1`);
            
            newContent += `\n\n${content}\n\n---\n`;
        }
    }
    
    fs.writeFileSync(artifactPath, newContent, 'utf-8');
    console.log(`Successfully fixed ${artifactPath}`);
}

fixArtifact(q51_q100_path, 51, 100);
fixArtifact(q101_q150_path, 101, 150);
