@echo off
chcp 65001 > nul
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║          授权码批量生成工具 - 快捷启动脚本               ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 请选择操作：
echo.
echo   1. 生成 10 个授权码（控制台显示）
echo   2. 生成 50 个授权码（保存到 codes-50.txt）
echo   3. 生成 100 个授权码（保存到 codes-100.txt）
echo   4. 生成 500 个授权码（保存到 codes-500.csv）
echo   5. 自定义数量
echo   6. 查看使用帮助
echo   0. 退出
echo.
set /p choice=请输入选项 (0-6):

if "%choice%"=="1" (
    echo.
    echo 正在生成 10 个授权码...
    node generate-codes.js 10
    goto end
)

if "%choice%"=="2" (
    echo.
    echo 正在生成 50 个授权码并保存到 codes-50.txt...
    node generate-codes.js 50 codes-50.txt
    goto end
)

if "%choice%"=="3" (
    echo.
    echo 正在生成 100 个授权码并保存到 codes-100.txt...
    node generate-codes.js 100 codes-100.txt
    goto end
)

if "%choice%"=="4" (
    echo.
    echo 正在生成 500 个授权码并保存到 codes-500.csv...
    node generate-codes.js 500 codes-500.csv
    goto end
)

if "%choice%"=="5" (
    echo.
    set /p count=请输入要生成的数量 (1-10000):
    set /p filename=请输入保存文件名（留空则在控制台显示）:
    echo.
    if "%filename%"=="" (
        node generate-codes.js %count%
    ) else (
        node generate-codes.js %count% %filename%
    )
    goto end
)

if "%choice%"=="6" (
    node generate-codes.js --help
    goto end
)

if "%choice%"=="0" (
    echo.
    echo 再见！
    exit /b
)

echo.
echo ❌ 无效的选项，请重新运行脚本
echo.

:end
echo.
echo 按任意键退出...
pause > nul
