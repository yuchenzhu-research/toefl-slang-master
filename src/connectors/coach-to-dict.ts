import { WeakExpressionSet, ExpressionCardSeed } from '../platform/contracts';

/**
 * Coach -> Dict Connector
 * 责任：将 TOEFL Coach 挖掘出的弱表达 (WeakExpressionSet)
 * 映射为 Dictionary Pro 生成词卡所需要的种子列表 (ExpressionCardSeed[])。
 */
export function mapCoachToDictSeeds(weakSet: WeakExpressionSet): ExpressionCardSeed[] {
  if (!weakSet || !weakSet.items) {
    return [];
  }

  return weakSet.items.map(item => {
    // 根据问题的来源或当前需求，设定词卡的终极对标注册语域
    const targetRegister = 'toefl-writing';

    return {
      seedExpression: item.weakExpression,
      seedContext: item.contextSentence || '',
      sourceOrigin: 'TOEFLCoach',
      targetRegister: targetRegister,
    } as ExpressionCardSeed;
  });
}

/**
 * 示例伪代码流：
 * 
 * async function coachToDictWorkflow(essayText: string) {
 *   // 1. 调用 TOEFL Coach
 *   const coachResult = await runTOEFLCoach(essayText);
 *   const weakSet = extractWeakExpressions(coachResult);
 *   
 *   // 2. Connector 转换
 *   const seeds = mapCoachToDictSeeds(weakSet);
 *   
 *   // 3. 将 Seeds 批量传给 Dictionary Pro 提词造卡
 *   for (const seed of seeds) {
 *     await generateExpressionCard(seed);
 *   }
 * }
 */
