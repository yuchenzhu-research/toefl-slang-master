import fs from 'fs';
import path from 'path';

export function runSemanticClusters() {
  console.log("\n>> [Semantic Clusters] Traversing synonym graph for largest families...");
  const graphPath = path.join(process.cwd(), 'outputs', 'indexes', 'graph.json');
  
  if (!fs.existsSync(graphPath)) {
    console.log("   [!] graph.json missing. Run 'tsm graph' first.");
    return;
  }

  const graph = JSON.parse(fs.readFileSync(graphPath, 'utf-8'));
  const components: string[][] = [];
  const visited = new Set<string>();

  for (const node of Object.keys(graph)) {
    if (!visited.has(node)) {
      const comp: string[] = [];
      const queue = [node];
      visited.add(node);

      while (queue.length > 0) {
        const curr = queue.shift()!;
        comp.push(curr);
        for (const neighbor of graph[curr] || []) {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            queue.push(neighbor);
          }
        }
      }
      if (comp.length > 1) components.push(comp);
    }
  }

  components.sort((a, b) => b.length - a.length);

  console.log(`\n>> Discovered ${components.length} multi-node semantic clusters!`);
  components.slice(0, 5).forEach((c, idx) => {
    console.log(`\n  Cluster ${idx + 1} (${c.length} words):`);
    console.log(`  => ${c.join(' <-> ')}`);
  });
  console.log("");
}
