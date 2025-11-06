#!/usr/bin/env node

/**
 * 授权码批量生成工具
 * 使用方法：
 * 1. cd backend
 * 2. node generate-codes.js <数量> [输出文件]
 *
 * 示例：
 * node generate-codes.js 100              # 生成100个授权码并显示在控制台
 * node generate-codes.js 100 codes.txt   # 生成100个授权码并保存到codes.txt
 */

import fs from 'fs';

// 生成随机授权码
function generateRandomCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// 生成唯一授权码（避免重复）
function generateUniqueCodes(count) {
  const codes = new Set();
  while (codes.size < count) {
    codes.add(generateRandomCode());
  }
  return Array.from(codes);
}

// 主函数
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║          恋爱占有欲测试 - 授权码批量生成工具              ║
╚════════════════════════════════════════════════════════════╝

使用方法:
  node generate-codes.js <数量> [输出文件]

参数说明:
  <数量>      必需，生成授权码的数量（1-10000）
  [输出文件]  可选，保存授权码的文件路径（默认显示在控制台）

示例:
  node generate-codes.js 10
    生成10个授权码并在控制台显示

  node generate-codes.js 100 codes.txt
    生成100个授权码并保存到codes.txt文件

  node generate-codes.js 500 codes.csv
    生成500个授权码并保存为CSV格式（带表头和序号）

选项:
  --help, -h    显示此帮助信息
    `);
    process.exit(0);
  }

  const count = parseInt(args[0]);
  const outputFile = args[1];

  // 验证数量
  if (isNaN(count) || count < 1 || count > 10000) {
    console.error('❌ 错误：数量必须在1到10000之间');
    process.exit(1);
  }

  console.log(`\n🔄 正在生成 ${count} 个授权码...\n`);

  // 生成授权码
  const codes = generateUniqueCodes(count);

  if (outputFile) {
    // 保存到文件
    try {
      let content;

      if (outputFile.endsWith('.csv')) {
        // CSV格式：序号,授权码,创建时间,状态
        const header = '序号,授权码,创建时间,状态\n';
        const rows = codes.map((code, index) =>
          `${index + 1},${code},${new Date().toISOString()},未使用`
        ).join('\n');
        content = header + rows;
      } else if (outputFile.endsWith('.json')) {
        // JSON格式
        const jsonData = codes.map((code, index) => ({
          id: index + 1,
          code: code,
          used: false,
          createdAt: new Date().toISOString()
        }));
        content = JSON.stringify(jsonData, null, 2);
      } else {
        // 纯文本格式（每行一个授权码）
        content = codes.join('\n');
      }

      fs.writeFileSync(outputFile, content, 'utf8');
      console.log(`✅ 成功生成 ${count} 个授权码！`);
      console.log(`📁 已保存到文件: ${outputFile}\n`);

      // 显示前5个示例
      console.log('前5个授权码示例:');
      codes.slice(0, 5).forEach((code, index) => {
        console.log(`  ${index + 1}. ${code}`);
      });
      if (count > 5) {
        console.log(`  ... 还有 ${count - 5} 个\n`);
      }
    } catch (error) {
      console.error(`❌ 保存文件失败: ${error.message}`);
      process.exit(1);
    }
  } else {
    // 在控制台显示
    console.log(`✅ 成功生成 ${count} 个授权码！\n`);
    console.log('╔════════════════════════════════════════════════════╗');
    console.log('║                   授权码列表                       ║');
    console.log('╚════════════════════════════════════════════════════╝\n');

    codes.forEach((code, index) => {
      console.log(`  ${(index + 1).toString().padStart(4, ' ')}. ${code}`);
    });
    console.log('');
  }

  // 统计信息
  console.log('📊 统计信息:');
  console.log(`  总数量: ${count}`);
  console.log(`  唯一性: 100% (已去重)`);
  console.log(`  格式: 8位大写字母+数字`);
  console.log('');
}

// 执行
main();
