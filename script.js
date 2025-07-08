// 全局变量
let elements = [];
let selectedElements = [];
let foregroundImages = [];
let compositionResults = [];
let clipboard = [];
let elementCounter = 0;
let currentTool = 'select';
let zoom = 1;
let canvasWidth = 1920;
let canvasHeight = 1080;

// 状态管理
let isDragging = false;
let isResizing = false;
let isRotating = false;
let isCropping = false;
let isSelecting = false;
let showGrid = false;
let showRuler = false;
let snapToGrid = false;

// 拖拽和选择相关变量
let dragStartX = 0;
let dragStartY = 0;
let selectionStartX = 0;
let selectionStartY = 0;
let currentResizeHandle = null;
let currentCropElement = null;

// 合成相关变量
let isComposing = false;
let compositionIndex = 0;

// 元素类型常量
const ElementType = {
    BACKGROUND: 'background',
    IMAGE: 'image',
    TEXT: 'text'
};

// 初始化应用
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    updateUI();
    
    // 加载保存的状态
    loadTempState();
    
    console.log('高级图像合成工具已初始化');
}

// 设置事件监听器
function setupEventListeners() {
    const canvas = document.getElementById('canvas');
    const canvasContainer = document.getElementById('canvasContainer');
    
    // 画布事件
    canvas.addEventListener('mousedown', onCanvasMouseDown);
    canvas.addEventListener('mousemove', onCanvasMouseMove);
    canvas.addEventListener('mouseup', onCanvasMouseUp);
    canvas.addEventListener('click', onCanvasClick);
    canvas.addEventListener('dblclick', onCanvasDoubleClick);
    
    // 拖拽导入
    canvas.addEventListener('dragover', onDragOver);
    canvas.addEventListener('drop', onDrop);
    
    // 全局事件
    document.addEventListener('mousemove', onGlobalMouseMove);
    document.addEventListener('mouseup', onGlobalMouseUp);
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    
    // 防止默认的选择行为
    canvas.addEventListener('selectstart', e => e.preventDefault());
    
    // 模态框事件
    setupModalEvents();
    
    // 窗口关闭前保存状态
    window.addEventListener('beforeunload', saveTempState);
}

// 设置模态框事件
function setupModalEvents() {
    // 点击模态框背景关闭
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this);
            }
        });
    });
}

// 画布鼠标按下事件
function onCanvasMouseDown(e) {
    const rect = e.target.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;
    
    dragStartX = x;
    dragStartY = y;
    
    if (currentTool === 'select') {
        handleSelectMouseDown(e, x, y);
    }
}

// 处理选择工具鼠标按下
function handleSelectMouseDown(e, x, y) {
    const clickedElement = getElementAt(x, y);
    const handle = clickedElement ? getResizeHandle(x, y, clickedElement) : null;
    
    if (handle === 'rotate') {
        startRotating(clickedElement, x, y);
    } else if (handle) {
        startResizing(clickedElement, handle, x, y);
    } else if (clickedElement) {
        if (!e.ctrlKey && !selectedElements.includes(clickedElement)) {
            clearSelection();
        }
        selectElement(clickedElement, e.ctrlKey);
        startDragging(x, y);
    } else {
        if (!e.ctrlKey) {
            clearSelection();
        }
        startSelecting(x, y);
    }
}

// 画布鼠标移动事件
function onCanvasMouseMove(e) {
    if (!isDragging && !isResizing && !isRotating && !isSelecting) return;
    
    const rect = e.target.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;
    
    if (isDragging) {
        handleDragging(x, y);
    } else if (isResizing) {
        handleResizing(x, y);
    } else if (isRotating) {
        handleRotating(x, y);
    } else if (isSelecting) {
        handleSelecting(x, y);
    }
}

// 画布鼠标抬起事件
function onCanvasMouseUp(e) {
    if (isDragging || isResizing || isRotating || isSelecting) {
        finishOperation();
    }
}

// 全局鼠标移动事件
function onGlobalMouseMove(e) {
    // 处理全局鼠标移动，用于拖拽到画布外
    if (isDragging || isResizing || isRotating) {
        const canvas = document.getElementById('canvas');
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / zoom;
        const y = (e.clientY - rect.top) / zoom;
        
        if (isDragging) {
            handleDragging(x, y);
        } else if (isResizing) {
            handleResizing(x, y);
        } else if (isRotating) {
            handleRotating(x, y);
        }
    }
}

// 全局鼠标抬起事件
function onGlobalMouseUp(e) {
    if (isDragging || isResizing || isRotating || isSelecting) {
        finishOperation();
    }
}

// 画布点击事件
function onCanvasClick(e) {
    // 在鼠标按下/移动/抬起之后处理
}

// 画布双击事件
function onCanvasDoubleClick(e) {
    const rect = e.target.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;
    
    const element = getElementAt(x, y);
    if (element && element.type === ElementType.TEXT) {
        startTextEditing(element);
    }
}

// 键盘事件
function onKeyDown(e) {
    // 如果正在编辑文字，不处理快捷键
    if (document.activeElement.contentEditable === 'true') {
        return;
    }
    
    switch (e.key) {
        case 'Delete':
            deleteSelectedElements();
            break;
        case 'Escape':
            clearSelection();
            break;
        case 'c':
            if (e.ctrlKey) {
                e.preventDefault();
                copySelectedElements();
            }
            break;
        case 'v':
            if (e.ctrlKey) {
                e.preventDefault();
                pasteElements();
            }
            break;
        case 'a':
            if (e.ctrlKey) {
                e.preventDefault();
                selectAllElements();
            }
            break;
        case 'd':
            if (e.ctrlKey) {
                e.preventDefault();
                duplicateSelectedElements();
            }
            break;
        case 'g':
            if (e.ctrlKey) {
                e.preventDefault();
                toggleGrid();
            }
            break;
        case 's':
            if (e.ctrlKey) {
                e.preventDefault();
                saveProject();
            }
            break;
    }
}

function onKeyUp(e) {
    // 键盘抬起事件处理
}

// 拖拽导入事件
function onDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    
    const canvas = document.getElementById('canvas');
    canvas.classList.add('drag-over');
}

function onDrop(e) {
    e.preventDefault();
    
    const canvas = document.getElementById('canvas');
    canvas.classList.remove('drag-over');
    
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > 0) {
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / zoom;
        const y = (e.clientY - rect.top) / zoom;
        
        imageFiles.forEach((file, index) => {
            createImageElement(file, x + index * 20, y + index * 20);
        });
    }
}

// 获取指定位置的元素
function getElementAt(x, y) {
    // 从最上层开始查找
    for (let i = elements.length - 1; i >= 0; i--) {
        const element = elements[i];
        if (isPointInElement(x, y, element)) {
            return element;
}

// 创建DOM元素
function createDOMElement(element) {
    const canvas = document.getElementById('canvas');
    const domElement = document.createElement('div');
    domElement.id = element.id;
    domElement.className = 'element';
    domElement.style.position = 'absolute';
    
    updateElementPosition(element);
    
    if (element.type === ElementType.IMAGE || element.type === ElementType.BACKGROUND) {
        const img = document.createElement('img');
        img.src = element.src;
        img.draggable = false;
        domElement.appendChild(img);
    } else if (element.type === ElementType.TEXT) {
        const textDiv = document.createElement('div');
        textDiv.className = 'text-content';
        textDiv.textContent = element.text || '';
        textDiv.style.fontSize = (element.fontSize || 16) + 'px';
        textDiv.style.color = element.color || '#000000';
        textDiv.style.fontFamily = element.fontFamily || 'Microsoft YaHei';
        textDiv.style.fontWeight = element.fontWeight || 'normal';
        textDiv.style.fontStyle = element.fontStyle || 'normal';
        textDiv.style.textAlign = element.textAlign || 'center';
        textDiv.style.lineHeight = element.lineHeight || '1.2';
        textDiv.style.letterSpacing = (element.letterSpacing || 0) + 'px';
        
        if (element.textStroke) {
            textDiv.style.webkitTextStroke = `${element.textStrokeWidth || 1}px ${element.textStrokeColor || '#000000'}`;
        }
        
        if (element.textShadow) {
            textDiv.style.textShadow = `${element.shadowX || 2}px ${element.shadowY || 2}px ${element.shadowBlur || 4}px ${element.shadowColor || 'rgba(0,0,0,0.5)'}`;
        }
        
        domElement.appendChild(textDiv);
    }
    
    canvas.appendChild(domElement);
}

// 更新元素位置和样式
function updateElementPosition(element) {
    const domElement = document.getElementById(element.id);
    if (!domElement) return;
    
    domElement.style.left = element.x + 'px';
    domElement.style.top = element.y + 'px';
    domElement.style.width = element.width + 'px';
    domElement.style.height = element.height + 'px';
    domElement.style.transform = `rotate(${element.rotation || 0}deg)`;
    domElement.style.opacity = element.opacity || 1;
    domElement.style.zIndex = element.zIndex || 0;
    
    updateElementAppearance(element);
}

// 更新元素外观
function updateElementAppearance(element) {
    const domElement = document.getElementById(element.id);
    if (!domElement) return;
    
    // 移除所有控制手柄
    domElement.querySelectorAll('.resize-handle, .rotate-handle').forEach(handle => handle.remove());
    
    if (selectedElements.includes(element)) {
        domElement.classList.add('selected');
        
        if (selectedElements.length === 1) {
            // 单选时添加控制手柄
            addControlHandles(domElement);
        }
    } else {
        domElement.classList.remove('selected');
    }
    
    if (selectedElements.length > 1 && selectedElements.includes(element)) {
        domElement.classList.add('multi-selected');
    } else {
        domElement.classList.remove('multi-selected');
    }
}

// 添加控制手柄
function addControlHandles(domElement) {
    const handles = ['nw', 'ne', 'sw', 'se', 'n', 's', 'w', 'e'];
    
    handles.forEach(handle => {
        const handleEl = document.createElement('div');
        handleEl.className = `resize-handle ${handle}`;
        domElement.appendChild(handleEl);
    });
    
    const rotateHandle = document.createElement('div');
    rotateHandle.className = 'rotate-handle';
    domElement.appendChild(rotateHandle);
}

// 导入背景图
function importBackground() {
    document.getElementById('backgroundInput').click();
}

function handleBackgroundUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!isValidImageFile(file)) {
        showToast('不支持的文件格式，请选择 JPG、PNG 或 GIF 文件', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        // 删除现有背景
        const existingBg = elements.find(el => el.type === ElementType.BACKGROUND);
        if (existingBg) {
            deleteElement(existingBg);
        }
        
        const img = new Image();
        img.onload = function() {
            const element = createElement(ElementType.BACKGROUND, {
                src: e.target.result,
                x: 0,
                y: 0,
                width: img.width,
                height: img.height,
                zIndex: -1
            });
            
            selectElement(element);
            showToast('背景图导入成功');
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// 添加图片
function addImage() {
    document.getElementById('imageInput').click();
}

function handleImageUpload(event) {
    const files = Array.from(event.target.files);
    
    files.forEach(file => {
        if (!isValidImageFile(file)) {
            showToast(`文件 ${file.name} 格式不支持`, 'error');
            return;
        }
        
        createImageElement(file);
    });
}

function createImageElement(file, x, y) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const element = createElement(ElementType.IMAGE, {
                src: e.target.result,
                x: x || canvasWidth / 2 - img.width / 2,
                y: y || canvasHeight / 2 - img.height / 2,
                width: img.width,
                height: img.height,
                originalWidth: img.width,
                originalHeight: img.height,
                filename: file.name
            });
            
            selectElement(element);
            showToast('图片添加成功');
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// 添加文字
function addText() {
    showModal('textModal');
}

function confirmAddText() {
    const text = document.getElementById('textInput').value.trim();
    if (!text) {
        showToast('请输入文字内容', 'warning');
        return;
    }
    
    const element = createElement(ElementType.TEXT, {
        text: text,
        fontSize: 24,
        color: '#000000',
        fontFamily: 'Microsoft YaHei',
        width: 200,
        height: 60
    });
    
    selectElement(element);
    closeModal('textModal');
    document.getElementById('textInput').value = '';
    showToast('文字添加成功');
}

function closeTextModal() {
    closeModal('textModal');
    document.getElementById('textInput').value = '';
}

// 导入前景图
function importForegrounds() {
    document.getElementById('foregroundInput').click();
}

function handleForegroundUpload(event) {
    const files = Array.from(event.target.files);
    
    files.forEach(file => {
        if (!isValidImageFile(file)) {
            showToast(`文件 ${file.name} 格式不支持`, 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                foregroundImages.push({
                    id: Date.now() + Math.random(),
                    name: file.name,
                    src: e.target.result,
                    width: img.width,
                    height: img.height
                });
                
                updateForegroundList();
                showToast(`前景图 ${file.name} 添加成功`);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
}

// 更新前景图列表
function updateForegroundList() {
    const list = document.getElementById('foregroundList');
    const count = document.getElementById('foregroundCount');
    
    count.textContent = foregroundImages.length;
    
    if (foregroundImages.length === 0) {
        list.innerHTML = '<div class="no-foregrounds">暂无前景图</div>';
        return;
    }
    
    list.innerHTML = foregroundImages.map(img => `
        <div class="foreground-item">
            <img src="${img.src}" alt="${img.name}" class="foreground-thumbnail">
            <span class="foreground-name">${img.name}</span>
            <button class="foreground-remove" onclick="removeForegroundImage('${img.id}')">×</button>
        </div>
    `).join('');
}

function removeForegroundImage(id) {
    foregroundImages = foregroundImages.filter(img => img.id != id);
    updateForegroundList();
    showToast('前景图已删除');
}

// 开始文字编辑
function startTextEditing(element) {
    const domElement = document.getElementById(element.id);
    const textDiv = domElement.querySelector('.text-content');
    
    textDiv.contentEditable = true;
    textDiv.focus();
    
    // 选中所有文字
    const range = document.createRange();
    range.selectNodeContents(textDiv);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    
    textDiv.addEventListener('blur', function() {
        textDiv.contentEditable = false;
        element.text = textDiv.textContent;
        saveTempState();
    }, { once: true });
    
    textDiv.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            textDiv.blur();
        }
    });
}

// 删除选中元素
function deleteSelectedElements() {
    if (selectedElements.length === 0) return;
    
    selectedElements.forEach(element => deleteElement(element));
    clearSelection();
    showToast(`已删除 ${selectedElements.length} 个元素`);
}

function deleteElement(element) {
    const index = elements.indexOf(element);
    if (index > -1) {
        elements.splice(index, 1);
        
        const domElement = document.getElementById(element.id);
        if (domElement) {
            domElement.remove();
        }
        
        // 从选择中移除
        const selectedIndex = selectedElements.indexOf(element);
        if (selectedIndex > -1) {
            selectedElements.splice(selectedIndex, 1);
        }
    }
    
    updateLayersList();
    saveTempState();
}

// 复制选中元素
function copySelectedElements() {
    if (selectedElements.length === 0) return;
    
    clipboard = selectedElements.map(element => ({...element}));
    showToast(`已复制 ${clipboard.length} 个元素`);
}

// 粘贴元素
function pasteElements() {
    if (clipboard.length === 0) return;
    
    clearSelection();
    
    clipboard.forEach(elementData => {
        const newElement = createElement(elementData.type, {
            ...elementData,
            x: elementData.x + 20,
            y: elementData.y + 20
        });
        selectElement(newElement, true);
    });
    
    showToast(`已粘贴 ${clipboard.length} 个元素`);
}

// 复制选中元素（快捷键用）
function duplicateSelectedElements() {
    copySelectedElements();
    pasteElements();
}

// 图层操作
function moveLayerUp() {
    if (selectedElements.length !== 1) return;
    
    const element = selectedElements[0];
    const index = elements.indexOf(element);
    
    if (index < elements.length - 1) {
        // 交换位置
        [elements[index], elements[index + 1]] = [elements[index + 1], elements[index]];
        
        // 更新zIndex
        elements.forEach((el, i) => {
            el.zIndex = i;
            updateElementPosition(el);
        });
        
        updateLayersList();
        saveTempState();
    }
}

function moveLayerDown() {
    if (selectedElements.length !== 1) return;
    
    const element = selectedElements[0];
    const index = elements.indexOf(element);
    
    if (index > 0) {
        // 交换位置
        [elements[index], elements[index - 1]] = [elements[index - 1], elements[index]];
        
        // 更新zIndex
        elements.forEach((el, i) => {
            el.zIndex = i;
            updateElementPosition(el);
        });
        
        updateLayersList();
        saveTempState();
    }
}

// 画布设置
function setCanvasSize(width, height) {
    canvasWidth = width;
    canvasHeight = height;
    applyCanvasSize();
}

function applyCustomSize() {
    const width = parseInt(document.getElementById('canvasWidth').value);
    const height = parseInt(document.getElementById('canvasHeight').value);
    
    if (width > 0 && height > 0) {
        setCanvasSize(width, height);
    } else {
        showToast('请输入有效的画布尺寸', 'warning');
    }
}

function applyCanvasSize() {
    const canvas = document.getElementById('canvas');
    canvas.style.width = canvasWidth + 'px';
    canvas.style.height = canvasHeight + 'px';
    
    updateUI();
    saveTempState();
}

function updateCanvasBackground() {
    const color = document.getElementById('canvasBgColor').value;
    const canvas = document.getElementById('canvas');
    canvas.style.backgroundColor = color;
    saveTempState();
}

// 工具选择
function selectTool() {
    currentTool = 'select';
    updateToolButtons();
}

function updateToolButtons() {
    document.querySelectorAll('.toolbar-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    if (currentTool === 'select') {
        document.getElementById('selectBtn').classList.add('active');
    }
}

// 网格控制
function toggleGrid() {
    showGrid = !showGrid;
    const grid = document.getElementById('grid');
    const btn = document.getElementById('gridBtn');
    
    if (showGrid) {
        grid.classList.add('show');
        btn.classList.add('active');
    } else {
        grid.classList.remove('show');
        btn.classList.remove('active');
    }
}

// 标尺控制
function toggleRuler() {
    showRuler = !showRuler;
    const rulerH = document.getElementById('rulerHorizontal');
    const rulerV = document.getElementById('rulerVertical');
    const btn = document.getElementById('rulerBtn');
    
    if (showRuler) {
        rulerH.classList.add('show');
        rulerV.classList.add('show');
        btn.classList.add('active');
    } else {
        rulerH.classList.remove('show');
        rulerV.classList.remove('show');
        btn.classList.remove('active');
    }
}

// 磁性对齐控制
function toggleSnap() {
    snapToGrid = !snapToGrid;
    const btn = document.getElementById('snapBtn');
    
    if (snapToGrid) {
        btn.classList.add('active');
        showToast('磁性对齐已开启');
    } else {
        btn.classList.remove('active');
        showToast('磁性对齐已关闭');
    }
}

// 对齐辅助线
function showAlignmentGuides() {
    // 这里可以添加对齐辅助线的显示逻辑
    // 暂时省略具体实现
}

function hideAlignmentGuides() {
    // 隐藏对齐辅助线
    document.querySelectorAll('.guide-line, .align-indicator').forEach(el => el.remove());
}

// 缩放控制
function zoomIn() {
    zoom = Math.min(zoom * 1.2, 3);
    applyZoom();
}

function zoomOut() {
    zoom = Math.max(zoom / 1.2, 0.1);
    applyZoom();
}

function resetZoom() {
    zoom = 1;
    applyZoom();
}

function applyZoom() {
    const wrapper = document.getElementById('canvasWrapper');
    wrapper.style.transform = `translate(-50%, -50%) scale(${zoom})`;
    
    document.getElementById('zoomLevel').textContent = Math.round(zoom * 100) + '%';
}

// 项目保存和加载
function saveProject() {
    const project = {
        version: '1.0',
        canvasWidth: canvasWidth,
        canvasHeight: canvasHeight,
        canvasBackground: document.getElementById('canvasBgColor').value,
        elements: elements,
        foregroundImages: foregroundImages,
        timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `项目_${new Date().toLocaleDateString()}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
    showToast('项目已保存');
}

function loadProject() {
    document.getElementById('projectInput').click();
}

function handleProjectLoad(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const project = JSON.parse(e.target.result);
            loadProjectData(project);
            showToast('项目加载成功');
        } catch (error) {
            showToast('项目文件格式错误', 'error');
        }
    };
    reader.readAsText(file);
}

function loadProjectData(project) {
    // 清空当前内容
    clearCanvas();
    
    // 恢复画布设置
    canvasWidth = project.canvasWidth || 1920;
    canvasHeight = project.canvasHeight || 1080;
    
    document.getElementById('canvasWidth').value = canvasWidth;
    document.getElementById('canvasHeight').value = canvasHeight;
    document.getElementById('canvasBgColor').value = project.canvasBackground || '#ffffff';
    
    applyCanvasSize();
    updateCanvasBackground();
    
    // 恢复元素
    elements = project.elements || [];
    elementCounter = Math.max(...elements.map(el => parseInt(el.id.split('_')[1])), 0);
    
    elements.forEach(element => {
        createDOMElement(element);
    });
    
    // 恢复前景图
    foregroundImages = project.foregroundImages || [];
    updateForegroundList();
    
    updateUI();
}

// 清空画布
function clearCanvas() {
    if (elements.length > 0) {
        showConfirmModal('清空画布', '确定要清空画布吗？此操作不可撤销。', () => {
            // 删除所有DOM元素
            elements.forEach(element => {
                const domElement = document.getElementById(element.id);
                if (domElement) {
                    domElement.remove();
                }
            });
            
            // 清空数据
            elements = [];
            selectedElements = [];
            foregroundImages = [];
            compositionResults = [];
            
            updateUI();
            saveTempState();
            showToast('画布已清空');
        });
    }
}

// 开始合成
function startComposition() {
    if (foregroundImages.length === 0) {
        showToast('请先导入前景图', 'warning');
        return;
    }
    
    if (elements.length === 0) {
        showToast('画布上没有元素', 'warning');
        return;
    }
    
    isComposing = true;
    compositionIndex = 0;
    compositionResults = [];
    
    document.getElementById('composeBtn').disabled = true;
    document.getElementById('stopBtn').disabled = false;
    document.getElementById('progressContainer').style.display = 'block';
    
    processNextComposition();
}

function processNextComposition() {
    if (!isComposing || compositionIndex >= foregroundImages.length) {
        finishComposition();
        return;
    }
    
    const foregroundImg = foregroundImages[compositionIndex];
    const progress = ((compositionIndex + 1) / foregroundImages.length) * 100;
    
    document.getElementById('progressText').textContent = 
        `正在处理 ${compositionIndex + 1}/${foregroundImages.length}: ${foregroundImg.name}`;
    document.getElementById('progressPercent').textContent = Math.round(progress) + '%';
    document.getElementById('progressFill').style.width = progress + '%';
    
    // 模拟异步处理
    setTimeout(() => {
        createCompositionResult(foregroundImg, compositionIndex + 1);
        compositionIndex++;
        
        if (isComposing) {
            processNextComposition();
        }
    }, 100);
}

function createCompositionResult(foregroundImg, index) {
    const canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext('2d');
    
    // 设置背景色
    ctx.fillStyle = document.getElementById('canvasBgColor').value;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // 按zIndex排序绘制元素
    const sortedElements = [...elements].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
    
    Promise.all(sortedElements.map(element => drawElementToCanvas(ctx, element, foregroundImg)))
        .then(() => {
            const dataURL = canvas.toDataURL('image/png');
            const result = {
                id: Date.now() + index,
                name: `合成结果_${String(index).padStart(3, '0')}.png`,
                src: dataURL,
                foregroundName: foregroundImg.name
            };
            
            compositionResults.push(result);
            updateResultsList();
        });
}

function drawElementToCanvas(ctx, element, foregroundImg) {
    return new Promise((resolve) => {
        if (element.type === ElementType.BACKGROUND || element.type === ElementType.IMAGE) {
            // 对于前景图替换逻辑，这里简化处理
            // 实际应用中可能需要更复杂的替换规则
            let srcToUse = element.src;
            if (element.type === ElementType.IMAGE && element.filename) {
                // 简单匹配：如果元素是最后添加的图片，则替换为前景图
                srcToUse = foregroundImg.src;
            }
            
            const img = new Image();
            img.onload = function() {
                ctx.save();
                ctx.globalAlpha = element.opacity || 1;
                
                if (element.rotation) {
                    ctx.translate(element.x + element.width / 2, element.y + element.height / 2);
                    ctx.rotate((element.rotation * Math.PI) / 180);
                    ctx.drawImage(img, -element.width / 2, -element.height / 2, element.width, element.height);
                } else {
                    ctx.drawImage(img, element.x, element.y, element.width, element.height);
                }
                
                ctx.restore();
                resolve();
            };
            img.src = srcToUse;
        } else if (element.type === ElementType.TEXT) {
            ctx.save();
            ctx.globalAlpha = element.opacity || 1;
            
            if (element.rotation) {
                ctx.translate(element.x + element.width / 2, element.y + element.height / 2);
                ctx.rotate((element.rotation * Math.PI) / 180);
            }
            
            ctx.font = `${element.fontWeight || 'normal'} ${element.fontStyle || 'normal'} ${element.fontSize || 16}px ${element.fontFamily || 'Microsoft YaHei'}`;
            ctx.fillStyle = element.color || '#000000';
            ctx.textAlign = element.textAlign || 'center';
            ctx.textBaseline = 'middle';
            
            const x = element.rotation ? 0 : element.x + element.width / 2;
            const y = element.rotation ? 0 : element.y + element.height / 2;
            
            if (element.textStroke) {
                ctx.strokeStyle = element.textStrokeColor || '#000000';
                ctx.lineWidth = element.textStrokeWidth || 1;
                ctx.strokeText(element.text || '', x, y);
            }
            
            ctx.fillText(element.text || '', x, y);
            
            ctx.restore();
            resolve();
        } else {
            resolve();
        }
    });
}

function stopComposition() {
    isComposing = false;
    finishComposition();
    showToast('合成已停止');
}

function finishComposition() {
    isComposing = false;
    
    document.getElementById('composeBtn').disabled = false;
    document.getElementById('stopBtn').disabled = true;
    document.getElementById('progressContainer').style.display = 'none';
    document.getElementById('downloadAllBtn').disabled = compositionResults.length === 0;
    
    if (compositionResults.length > 0) {
        showToast(`合成完成！生成了 ${compositionResults.length} 张图片`);
    }
}

// 更新结果列表
function updateResultsList() {
    const list = document.getElementById('resultsList');
    const count = document.getElementById('resultCount');
    
    count.textContent = compositionResults.length;
    
    if (compositionResults.length === 0) {
        list.innerHTML = '<div class="no-results">点击"开始合成"生成结果</div>';
        return;
    }
    
    list.innerHTML = compositionResults.map(result => `
        <div class="result-item">
            <img src="${result.src}" alt="${result.name}" class="result-thumbnail">
            <div class="result-info">
                <div class="result-name">${result.name}</div>
                <div class="result-size">基于: ${result.foregroundName}</div>
            </div>
            <button class="result-download" onclick="downloadResult('${result.id}')">下载</button>
        </div>
    `).join('');
}

function downloadResult(id) {
    const result = compositionResults.find(r => r.id == id);
    if (!result) return;
    
    const a = document.createElement('a');
    a.href = result.src;
    a.download = result.name;
    a.click();
    
    showToast(`正在下载 ${result.name}`);
}

function downloadAllResults() {
    if (compositionResults.length === 0) return;
    
    compositionResults.forEach((result, index) => {
        setTimeout(() => {
            downloadResult(result.id);
        }, index * 500); // 间隔500ms下载，避免浏览器阻止
    });
    
    showToast(`正在批量下载 ${compositionResults.length} 张图片`);
}

// UI更新函数
function updateUI() {
    updateLayersList();
    updatePropertiesPanel();
    updateForegroundList();
    updateResultsList();
}

function updateLayersList() {
    const list = document.getElementById('layersList');
    
    if (elements.length === 0) {
        list.innerHTML = '<div class="no-layers">暂无图层</div>';
        return;
    }
    
    // 按zIndex倒序显示（顶层在上）
    const sortedElements = [...elements].sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0));
    
    list.innerHTML = sortedElements.map(element => {
        const isSelected = selectedElements.includes(element);
        const typeText = {
            [ElementType.BACKGROUND]: '背景',
            [ElementType.IMAGE]: '图片',
            [ElementType.TEXT]: '文字'
        }[element.type];
        
        const displayName = element.type === ElementType.TEXT 
            ? (element.text || '文字') 
            : (element.filename || typeText);
        
        return `
            <div class="layer-item ${isSelected ? 'selected' : ''}" onclick="selectElementById('${element.id}')">
                <span>${displayName}</span>
                <span class="layer-type">${typeText}</span>
            </div>
        `;
    }).join('');
}

function selectElementById(id) {
    const element = elements.find(el => el.id === id);
    if (element) {
        clearSelection();
        selectElement(element);
    }
}

function updatePropertiesPanel() {
    const panel = document.getElementById('propertiesPanel');
    
    if (selectedElements.length === 0) {
        panel.innerHTML = '<div class="no-selection">请选择一个图层进行编辑</div>';
        return;
    }
    
    if (selectedElements.length > 1) {
        panel.innerHTML = `<div class="no-selection">已选中 ${selectedElements.length} 个图层</div>`;
        return;
    }
    
    const element = selectedElements[0];
    
    let html = '';
    
    // 通用属性
    html += `
        <div class="property-group">
            <label class="property-label">位置和大小</label>
            <div class="property-row">
                <label>X:</label>
                <input type="number" value="${Math.round(element.x)}" onchange="updateElementProperty('${element.id}', 'x', parseFloat(this.value))">
            </div>
            <div class="property-row">
                <label>Y:</label>
                <input type="number" value="${Math.round(element.y)}" onchange="updateElementProperty('${element.id}', 'y', parseFloat(this.value))">
            </div>
            <div class="property-row">
                <label>宽:</label>
                <input type="number" value="${Math.round(element.width)}" onchange="updateElementProperty('${element.id}', 'width', parseFloat(this.value))">
            </div>
            <div class="property-row">
                <label>高:</label>
                <input type="number" value="${Math.round(element.height)}" onchange="updateElementProperty('${element.id}', 'height', parseFloat(this.value))">
            </div>
        </div>
        
        <div class="property-group">
            <label class="property-label">变换</label>
            <div class="property-row">
                <label>旋转:</label>
                <input type="number" value="${Math.round(element.rotation || 0)}" onchange="updateElementProperty('${element.id}', 'rotation', parseFloat(this.value))">
                <span>°</span>
            </div>
            <div class="property-row">
                <label>透明度:</label>
                <input type="range" min="0" max="1" step="0.1" value="${element.opacity || 1}" onchange="updateElementProperty('${element.id}', 'opacity', parseFloat(this.value))">
                <span>${Math.round((element.opacity || 1) * 100)}%</span>
            </div>
        </div>
    `;
    
    // 图片特有属性
    if (element.type === ElementType.IMAGE || element.type === ElementType.BACKGROUND) {
        html += `
            <div class="property-group">
                <label class="property-label">图片操作</label>
                <button class="btn btn-secondary" onclick="cropImage('${element.id}')">🔲 裁剪</button>
                <button class="btn btn-secondary" onclick="flipImage('${element.id}', 'horizontal')">↔️ 水平翻转</button>
                <button class="btn btn-secondary" onclick="flipImage('${element.id}', 'vertical')">↕️ 垂直翻转</button>
            </div>
        `;
    }
    
    // 文字特有属性
    if (element.type === ElementType.TEXT) {
        html += `
            <div class="property-group">
                <label class="property-label">文字内容</label>
                <textarea class="property-input" onchange="updateElementProperty('${element.id}', 'text', this.value)">${element.text || ''}</textarea>
            </div>
            
            <div class="property-group">
                <label class="property-label">字体样式</label>
                <div class="property-row">
                    <label>字体:</label>
                    <select onchange="updateElementProperty('${element.id}', 'fontFamily', this.value)">
                        <option value="Microsoft YaHei" ${element.fontFamily === 'Microsoft YaHei' ? 'selected' : ''}>微软雅黑</option>
                        <option value="SimSun" ${element.fontFamily === 'SimSun' ? 'selected' : ''}>宋体</option>
                        <option value="SimHei" ${element.fontFamily === 'SimHei' ? 'selected' : ''}>黑体</option>
                    </select>
                </div>
                <div class="property-row">
                    <label>大小:</label>
                    <input type="number" value="${element.fontSize || 16}" min="8" max="200" onchange="updateElementProperty('${element.id}', 'fontSize', parseInt(this.value))">
                    <span>px</span>
                </div>
                <div class="property-row">
                    <label>颜色:</label>
                    <input type="color" value="${element.color || '#000000'}" onchange="updateElementProperty('${element.id}', 'color', this.value)">
                </div>
            </div>
            
            <div class="property-group">
                <label class="property-label">文字效果</label>
                <div class="property-row">
                    <label>粗体:</label>
                    <input type="checkbox" ${element.fontWeight === 'bold' ? 'checked' : ''} onchange="updateElementProperty('${element.id}', 'fontWeight', this.checked ? 'bold' : 'normal')">
                </div>
                <div class="property-row">
                    <label>斜体:</label>
                    <input type="checkbox" ${element.fontStyle === 'italic' ? 'checked' : ''} onchange="updateElementProperty('${element.id}', 'fontStyle', this.checked ? 'italic' : 'normal')">
                </div>
                <div class="property-row">
                    <label>对齐:</label>
                    <select onchange="updateElementProperty('${element.id}', 'textAlign', this.value)">
                        <option value="left" ${element.textAlign === 'left' ? 'selected' : ''}>左对齐</option>
                        <option value="center" ${element.textAlign === 'center' ? 'selected' : ''}>居中</option>
                        <option value="right" ${element.textAlign === 'right' ? 'selected' : ''}>右对齐</option>
                    </select>
                </div>
                <div class="property-row">
                    <label>行间距:</label>
                    <input type="number" value="${element.lineHeight || 1.2}" min="0.8" max="3" step="0.1" onchange="updateElementProperty('${element.id}', 'lineHeight', parseFloat(this.value))">
                </div>
                <div class="property-row">
                    <label>字间距:</label>
                    <input type="number" value="${element.letterSpacing || 0}" min="-5" max="20" onchange="updateElementProperty('${element.id}', 'letterSpacing', parseInt(this.value))">
                    <span>px</span>
                </div>
            </div>
            
            <div class="property-group">
                <label class="property-label">描边和阴影</label>
                <div class="property-row">
                    <label>描边:</label>
                    <input type="checkbox" ${element.textStroke ? 'checked' : ''} onchange="updateElementProperty('${element.id}', 'textStroke', this.checked)">
                </div>
                ${element.textStroke ? `
                <div class="property-row">
                    <label>描边宽度:</label>
                    <input type="number" value="${element.textStrokeWidth || 1}" min="1" max="10" onchange="updateElementProperty('${element.id}', 'textStrokeWidth', parseInt(this.value))">
                </div>
                <div class="property-row">
                    <label>描边颜色:</label>
                    <input type="color" value="${element.textStrokeColor || '#000000'}" onchange="updateElementProperty('${element.id}', 'textStrokeColor', this.value)">
                </div>
                ` : ''}
                <div class="property-row">
                    <label>阴影:</label>
                    <input type="checkbox" ${element.textShadow ? 'checked' : ''} onchange="updateElementProperty('${element.id}', 'textShadow', this.checked)">
                </div>
                ${element.textShadow ? `
                <div class="property-row">
                    <label>阴影X:</label>
                    <input type="number" value="${element.shadowX || 2}" min="-20" max="20" onchange="updateElementProperty('${element.id}', 'shadowX', parseInt(this.value))">
                </div>
                <div class="property-row">
                    <label>阴影Y:</label>
                    <input type="number" value="${element.shadowY || 2}" min="-20" max="20" onchange="updateElementProperty('${element.id}', 'shadowY', parseInt(this.value))">
                </div>
                <div class="property-row">
                    <label>模糊:</label>
                    <input type="number" value="${element.shadowBlur || 4}" min="0" max="20" onchange="updateElementProperty('${element.id}', 'shadowBlur', parseInt(this.value))">
                </div>
                <div class="property-row">
                    <label>阴影颜色:</label>
                    <input type="color" value="${element.shadowColor || '#000000'}" onchange="updateElementProperty('${element.id}', 'shadowColor', this.value)">
                </div>
                ` : ''}
            </div>
        `;
    }
    
    panel.innerHTML = html;
}

function updateElementProperty(id, property, value) {
    const element = elements.find(el => el.id === id);
    if (!element) return;
    
    element[property] = value;
    
    if (element.type === ElementType.TEXT) {
        updateTextElementStyle(element);
    }
    
    updateElementPosition(element);
    saveTempState();
}

function updateTextElementStyle(element) {
    const domElement = document.getElementById(element.id);
    const textDiv = domElement.querySelector('.text-content');
    
    if (!textDiv) return;
    
    textDiv.textContent = element.text || '';
    textDiv.style.fontSize = (element.fontSize || 16) + 'px';
    textDiv.style.color = element.color || '#000000';
    textDiv.style.fontFamily = element.fontFamily || 'Microsoft YaHei';
    textDiv.style.fontWeight = element.fontWeight || 'normal';
    textDiv.style.fontStyle = element.fontStyle || 'normal';
    textDiv.style.textAlign = element.textAlign || 'center';
    textDiv.style.lineHeight = element.lineHeight || '1.2';
    textDiv.style.letterSpacing = (element.letterSpacing || 0) + 'px';
    
    if (element.textStroke) {
        textDiv.style.webkitTextStroke = `${element.textStrokeWidth || 1}px ${element.textStrokeColor || '#000000'}`;
    } else {
        textDiv.style.webkitTextStroke = '';
    }
    
    if (element.textShadow) {
        textDiv.style.textShadow = `${element.shadowX || 2}px ${element.shadowY || 2}px ${element.shadowBlur || 4}px ${element.shadowColor || 'rgba(0,0,0,0.5)'}`;
    } else {
        textDiv.style.textShadow = '';
    }
}

// 图片操作函数
function cropImage(id) {
    const element = elements.find(el => el.id === id);
    if (!element) return;
    
    currentCropElement = element;
    
    const cropImg = document.getElementById('cropImage');
    cropImg.src = element.src;
    
    showModal('cropModal');
    
    // 初始化裁剪框
    setTimeout(() => {
        initCropSelection();
    }, 100);
}

function initCropSelection() {
    const cropImg = document.getElementById('cropImage');
    const selection = document.getElementById('cropSelection');
    
    const imgRect = cropImg.getBoundingClientRect();
    const containerRect = cropImg.parentElement.getBoundingClientRect();
    
    // 设置初始选择区域为图片的中心80%
    const selectionWidth = imgRect.width * 0.8;
    const selectionHeight = imgRect.height * 0.8;
    const selectionX = (imgRect.width - selectionWidth) / 2;
    const selectionY = (imgRect.height - selectionHeight) / 2;
    
    selection.style.left = selectionX + 'px';
    selection.style.top = selectionY + 'px';
    selection.style.width = selectionWidth + 'px';
    selection.style.height = selectionHeight + 'px';
    
    // 添加拖拽事件
    setupCropDrag();
}

function setupCropDrag() {
    // 裁剪拖拽功能的实现
    // 为了简化，这里只提供基础框架
}

function applyCrop() {
    if (!currentCropElement) return;
    
    // 获取裁剪参数
    const selection = document.getElementById('cropSelection');
    const cropImg = document.getElementById('cropImage');
    
    const scaleX = currentCropElement.originalWidth / cropImg.naturalWidth;
    const scaleY = currentCropElement.originalHeight / cropImg.naturalHeight;
    
    const cropX = parseInt(selection.style.left) * scaleX;
    const cropY = parseInt(selection.style.top) * scaleY;
    const cropWidth = parseInt(selection.style.width) * scaleX;
    const cropHeight = parseInt(selection.style.height) * scaleY;
    
    // 创建裁剪后的图片
    const canvas = document.createElement('canvas');
    canvas.width = cropWidth;
    canvas.height = cropHeight;
    const ctx = canvas.getContext('2d');
    
    const img = new Image();
    img.onload = function() {
        ctx.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
        
        currentCropElement.src = canvas.toDataURL();
        currentCropElement.width = cropWidth;
        currentCropElement.height = cropHeight;
        currentCropElement.originalWidth = cropWidth;
        currentCropElement.originalHeight = cropHeight;
        
        updateElementPosition(currentCropElement);
        closeCropModal();
        showToast('图片裁剪完成');
    };
    img.src = currentCropElement.src;
}

function closeCropModal() {
    closeModal('cropModal');
    currentCropElement = null;
}

function flipImage(id, direction) {
    const element = elements.find(el => el.id === id);
    if (!element) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = element.width;
    canvas.height = element.height;
    const ctx = canvas.getContext('2d');
    
    const img = new Image();
    img.onload = function() {
        ctx.save();
        
        if (direction === 'horizontal') {
            ctx.scale(-1, 1);
            ctx.drawImage(img, -canvas.width, 0, canvas.width, canvas.height);
        } else {
            ctx.scale(1, -1);
            ctx.drawImage(img, 0, -canvas.height, canvas.width, canvas.height);
        }
        
        ctx.restore();
        
        element.src = canvas.toDataURL();
        updateElementPosition(element);
        showToast(`图片${direction === 'horizontal' ? '水平' : '垂直'}翻转完成`);
    };
    img.src = element.src;
}

// 工具函数
function isValidImageFile(file) {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    return validTypes.includes(file.type);
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('show');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('show');
}

function showConfirmModal(title, message, onConfirm) {
    document.getElementById('confirmTitle').textContent = title;
    document.getElementById('confirmMessage').textContent = message;
    
    const confirmBtn = document.getElementById('confirmBtn');
    confirmBtn.onclick = function() {
        onConfirm();
        closeConfirmModal();
    };
    
    showModal('confirmModal');
}

function closeConfirmModal() {
    closeModal('confirmModal');
}

function confirmAction() {
    // 由showConfirmModal动态设置
}

// 临时状态保存（用于页面刷新恢复）
function saveTempState() {
    const state = {
        elements: elements,
        foregroundImages: foregroundImages,
        canvasWidth: canvasWidth,
        canvasHeight: canvasHeight,
        canvasBackground: document.getElementById('canvasBgColor').value,
        zoom: zoom,
        showGrid: showGrid,
        showRuler: showRuler,
        snapToGrid: snapToGrid
    };
    
    try {
        sessionStorage.setItem('imageComposerTempState', JSON.stringify(state));
    } catch (error) {
        console.warn('无法保存临时状态:', error);
    }
}

function loadTempState() {
    try {
        const stateStr = sessionStorage.getItem('imageComposerTempState');
        if (!stateStr) return;
        
        const state = JSON.parse(stateStr);
        
        // 恢复画布设置
        canvasWidth = state.canvasWidth || 1920;
        canvasHeight = state.canvasHeight || 1080;
        document.getElementById('canvasWidth').value = canvasWidth;
        document.getElementById('canvasHeight').value = canvasHeight;
        document.getElementById('canvasBgColor').value = state.canvasBackground || '#ffffff';
        
        applyCanvasSize();
        updateCanvasBackground();
        
        // 恢复元素
        elements = state.elements || [];
        elementCounter = elements.length > 0 ? Math.max(...elements.map(el => parseInt(el.id.split('_')[1]))) : 0;
        
        elements.forEach(element => {
            createDOMElement(element);
        });
        
        // 恢复前景图
        foregroundImages = state.foregroundImages || [];
        
        // 恢复界面状态
        zoom = state.zoom || 1;
        showGrid = state.showGrid || false;
        showRuler = state.showRuler || false;
        snapToGrid = state.snapToGrid || false;
        
        applyZoom();
        
        if (showGrid) {
            document.getElementById('grid').classList.add('show');
            document.getElementById('gridBtn').classList.add('active');
        }
        
        if (showRuler) {
            document.getElementById('rulerHorizontal').classList.add('show');
            document.getElementById('rulerVertical').classList.add('show');
            document.getElementById('rulerBtn').classList.add('active');
        }
        
        if (snapToGrid) {
            document.getElementById('snapBtn').classList.add('active');
        }
        
        updateUI();
        
    } catch (error) {
        console.warn('无法加载临时状态:', error);
    }
};
        }
    }
    return null;
}

// 检查点是否在元素内
function isPointInElement(x, y, element) {
    return x >= element.x && x <= element.x + element.width &&
           y >= element.y && y <= element.y + element.height;
}

// 获取调整手柄
function getResizeHandle(x, y, element) {
    if (!selectedElements.includes(element)) return null;
    
    const handles = [
        { name: 'nw', x: element.x - 6, y: element.y - 6 },
        { name: 'ne', x: element.x + element.width - 6, y: element.y - 6 },
        { name: 'sw', x: element.x - 6, y: element.y + element.height - 6 },
        { name: 'se', x: element.x + element.width - 6, y: element.y + element.height - 6 },
        { name: 'n', x: element.x + element.width / 2 - 6, y: element.y - 6 },
        { name: 's', x: element.x + element.width / 2 - 6, y: element.y + element.height - 6 },
        { name: 'w', x: element.x - 6, y: element.y + element.height / 2 - 6 },
        { name: 'e', x: element.x + element.width - 6, y: element.y + element.height / 2 - 6 },
        { name: 'rotate', x: element.x + element.width / 2 - 8, y: element.y - 25 }
    ];
    
    for (const handle of handles) {
        if (x >= handle.x && x <= handle.x + 16 && y >= handle.y && y <= handle.y + 16) {
            return handle.name;
        }
    }
    
    return null;
}

// 开始拖拽
function startDragging(x, y) {
    isDragging = true;
    
    selectedElements.forEach(element => {
        element.dragOffsetX = x - element.x;
        element.dragOffsetY = y - element.y;
    });
}

// 处理拖拽
function handleDragging(x, y) {
    selectedElements.forEach(element => {
        const newX = x - element.dragOffsetX;
        const newY = y - element.dragOffsetY;
        
        if (snapToGrid) {
            element.x = Math.round(newX / 20) * 20;
            element.y = Math.round(newY / 20) * 20;
        } else {
            element.x = newX;
            element.y = newY;
        }
        
        updateElementPosition(element);
    });
    
    showAlignmentGuides();
}

// 开始调整大小
function startResizing(element, handle, x, y) {
    isResizing = true;
    currentResizeHandle = handle;
    
    // 只调整选中的第一个元素
    if (!selectedElements.includes(element)) {
        clearSelection();
        selectElement(element);
    }
}

// 处理调整大小
function handleResizing(x, y) {
    if (selectedElements.length === 0) return;
    
    const element = selectedElements[0];
    const handle = currentResizeHandle;
    const minSize = 20;
    
    switch (handle) {
        case 'nw':
            const newWidthNW = Math.max(minSize, element.width + (element.x - x));
            const newHeightNW = Math.max(minSize, element.height + (element.y - y));
            element.x = element.x + element.width - newWidthNW;
            element.y = element.y + element.height - newHeightNW;
            element.width = newWidthNW;
            element.height = newHeightNW;
            break;
        case 'ne':
            element.width = Math.max(minSize, x - element.x);
            element.height = Math.max(minSize, element.height + (element.y - y));
            element.y = element.y + element.height - Math.max(minSize, element.height + (element.y - y));
            break;
        case 'sw':
            element.width = Math.max(minSize, element.width + (element.x - x));
            element.height = Math.max(minSize, y - element.y);
            element.x = element.x + element.width - Math.max(minSize, element.width + (element.x - x));
            break;
        case 'se':
            element.width = Math.max(minSize, x - element.x);
            element.height = Math.max(minSize, y - element.y);
            break;
        case 'n':
            element.height = Math.max(minSize, element.height + (element.y - y));
            element.y = element.y + element.height - Math.max(minSize, element.height + (element.y - y));
            break;
        case 's':
            element.height = Math.max(minSize, y - element.y);
            break;
        case 'w':
            element.width = Math.max(minSize, element.width + (element.x - x));
            element.x = element.x + element.width - Math.max(minSize, element.width + (element.x - x));
            break;
        case 'e':
            element.width = Math.max(minSize, x - element.x);
            break;
    }
    
    updateElementPosition(element);
}

// 开始旋转
function startRotating(element, x, y) {
    isRotating = true;
    
    if (!selectedElements.includes(element)) {
        clearSelection();
        selectElement(element);
    }
}

// 处理旋转
function handleRotating(x, y) {
    if (selectedElements.length === 0) return;
    
    const element = selectedElements[0];
    const centerX = element.x + element.width / 2;
    const centerY = element.y + element.height / 2;
    
    const angle = Math.atan2(y - centerY, x - centerX) * 180 / Math.PI + 90;
    element.rotation = angle;
    
    updateElementPosition(element);
}

// 开始框选
function startSelecting(x, y) {
    isSelecting = true;
    selectionStartX = x;
    selectionStartY = y;
    
    const selectionBox = document.getElementById('selectionBox');
    selectionBox.style.display = 'block';
    selectionBox.style.left = x + 'px';
    selectionBox.style.top = y + 'px';
    selectionBox.style.width = '0px';
    selectionBox.style.height = '0px';
}

// 处理框选
function handleSelecting(x, y) {
    const selectionBox = document.getElementById('selectionBox');
    const left = Math.min(selectionStartX, x);
    const top = Math.min(selectionStartY, y);
    const width = Math.abs(x - selectionStartX);
    const height = Math.abs(y - selectionStartY);
    
    selectionBox.style.left = left + 'px';
    selectionBox.style.top = top + 'px';
    selectionBox.style.width = width + 'px';
    selectionBox.style.height = height + 'px';
    
    // 选择框内的元素
    const selectedInBox = elements.filter(element => {
        return element.x < left + width && element.x + element.width > left &&
               element.y < top + height && element.y + element.height > top;
    });
    
    clearSelection();
    selectedInBox.forEach(element => selectElement(element, true));
}

// 完成操作
function finishOperation() {
    isDragging = false;
    isResizing = false;
    isRotating = false;
    isSelecting = false;
    currentResizeHandle = null;
    
    // 隐藏选择框
    const selectionBox = document.getElementById('selectionBox');
    selectionBox.style.display = 'none';
    
    // 隐藏对齐指示线
    hideAlignmentGuides();
    
    // 保存临时状态
    saveTempState();
}

// 选择元素
function selectElement(element, multiple = false) {
    if (!multiple) {
        clearSelection();
    }
    
    if (!selectedElements.includes(element)) {
        selectedElements.push(element);
        updateElementAppearance(element);
        updatePropertiesPanel();
        updateLayersList();
    }
}

// 清除选择
function clearSelection() {
    selectedElements.forEach(element => {
        updateElementAppearance(element);
    });
    selectedElements = [];
    updatePropertiesPanel();
    updateLayersList();
}

// 选择所有元素
function selectAllElements() {
    clearSelection();
    elements.forEach(element => selectElement(element, true));
}

// 创建元素
function createElement(type, options = {}) {
    const element = {
        id: `element_${++elementCounter}`,
        type: type,
        x: options.x || canvasWidth / 2 - 100,
        y: options.y || canvasHeight / 2 - 75,
        width: options.width || 200,
        height: options.height || 150,
        rotation: options.rotation || 0,
        opacity: options.opacity || 1,
        zIndex: elements.length,
        ...options
    };
    
    elements.push(element);
    createDOMElement(element);
    updateLayersList();
    saveTempState();
    
    return element
