#!/bin/bash

# 腾讯云函数测试脚本
# 使用方法: ./test.sh <云函数地址>

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查参数
if [ -z "$1" ]; then
    echo -e "${RED}错误: 请提供云函数地址${NC}"
    echo "使用方法: ./test.sh https://your-cloud-function-url"
    exit 1
fi

FUNCTION_URL=$1

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}腾讯云函数测试脚本${NC}"
echo -e "${YELLOW}========================================${NC}"
echo ""

# 测试1: 验证有效授权码
echo -e "${YELLOW}测试1: 验证有效授权码 (LOVE2025)${NC}"
RESPONSE=$(curl -s -X POST "$FUNCTION_URL" \
  -H "Content-Type: application/json" \
  -d '{"code":"LOVE2025"}')

if echo "$RESPONSE" | grep -q '"success":true'; then
    echo -e "${GREEN}✓ 通过${NC}"
    echo "响应: $RESPONSE"
else
    echo -e "${RED}✗ 失败${NC}"
    echo "响应: $RESPONSE"
fi
echo ""

# 测试2: 验证无效授权码
echo -e "${YELLOW}测试2: 验证无效授权码 (INVALID)${NC}"
RESPONSE=$(curl -s -X POST "$FUNCTION_URL" \
  -H "Content-Type: application/json" \
  -d '{"code":"INVALID"}')

if echo "$RESPONSE" | grep -q '"success":false'; then
    echo -e "${GREEN}✓ 通过${NC}"
    echo "响应: $RESPONSE"
else
    echo -e "${RED}✗ 失败${NC}"
    echo "响应: $RESPONSE"
fi
echo ""

# 测试3: 空授权码
echo -e "${YELLOW}测试3: 空授权码${NC}"
RESPONSE=$(curl -s -X POST "$FUNCTION_URL" \
  -H "Content-Type: application/json" \
  -d '{"code":""}')

if echo "$RESPONSE" | grep -q '"success":false'; then
    echo -e "${GREEN}✓ 通过${NC}"
    echo "响应: $RESPONSE"
else
    echo -e "${RED}✗ 失败${NC}"
    echo "响应: $RESPONSE"
fi
echo ""

# 测试4: CORS预检请求
echo -e "${YELLOW}测试4: CORS预检请求${NC}"
RESPONSE=$(curl -s -X OPTIONS "$FUNCTION_URL" -I)

if echo "$RESPONSE" | grep -q "Access-Control-Allow-Origin"; then
    echo -e "${GREEN}✓ 通过 - CORS已正确配置${NC}"
else
    echo -e "${RED}✗ 失败 - CORS未配置${NC}"
fi
echo ""

# 测试5: 查询授权码列表(需要管理员密钥)
echo -e "${YELLOW}测试5: 查询授权码列表 (管理员功能)${NC}"
RESPONSE=$(curl -s -X POST "$FUNCTION_URL" \
  -H "Content-Type: application/json" \
  -d '{"action":"list","adminKey":"admin123"}')

if echo "$RESPONSE" | grep -q '"success":true'; then
    echo -e "${GREEN}✓ 通过${NC}"
    echo "响应: $RESPONSE"
else
    echo -e "${RED}✗ 失败${NC}"
    echo "响应: $RESPONSE"
fi
echo ""

# 测试6: 生成新授权码(需要管理员密钥)
echo -e "${YELLOW}测试6: 生成新授权码 (管理员功能)${NC}"
RESPONSE=$(curl -s -X POST "$FUNCTION_URL" \
  -H "Content-Type: application/json" \
  -d '{"action":"generate","count":3,"adminKey":"admin123"}')

if echo "$RESPONSE" | grep -q '"success":true'; then
    echo -e "${GREEN}✓ 通过${NC}"
    echo "响应: $RESPONSE"
else
    echo -e "${RED}✗ 失败${NC}"
    echo "响应: $RESPONSE"
fi
echo ""

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}测试完成!${NC}"
echo -e "${YELLOW}========================================${NC}"
