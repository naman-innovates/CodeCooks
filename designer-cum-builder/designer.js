document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    const addTextBtn = document.getElementById('addTextBtn');
    const addImageBtn = document.getElementById('addImageBtn');
    const addShapeBtn = document.getElementById('addShapeBtn');
    const addButtonBtn = document.getElementById('addButtonBtn');
    const elementText = document.getElementById('elementText');
    const elementColor = document.getElementById('elementColor');
    const elementFontSize = document.getElementById('elementFontSize');
    const elementBgColor = document.getElementById('elementBgColor');
    const elementBorderRadius = document.getElementById('elementBorderRadius');
    const elementAnimation = document.getElementById('elementAnimation');
    const buttonProperties = document.getElementById('buttonProperties');
    const buttonLink = document.getElementById('buttonLink');
    const buttonTarget = document.getElementById('buttonTarget');
    const imageProperties = document.getElementById('imageProperties');
    const imageUpload = document.getElementById('imageUpload');
    const gridSize = document.getElementById('gridSize');
    const codeView = document.getElementById('codeView');
    const codeContent = document.getElementById('codeContent');
    const htmlTab = document.getElementById('htmlTab');
    const cssTab = document.getElementById('cssTab');
    const jsTab = document.getElementById('jsTab');
    const pageTabs = document.getElementById('pageTabs');
    const addPageBtn = document.getElementById('addPageBtn');
    const undoBtn = document.getElementById('undoBtn');
    const redoBtn = document.getElementById('redoBtn');
    const deleteElementBtn = document.getElementById('deleteElementBtn');
    const saveDesignBtn = document.getElementById('saveDesignBtn');
    const loadDesignBtn = document.getElementById('loadDesignBtn');

    let selectedElement = null;
    let elements = [];
    let currentCodeTab = 'html';
    let pages = ['Page 1'];
    let currentPage = 'Page 1';
    let actionHistory = [];
    let actionFuture = [];

    addTextBtn.addEventListener('click', () => addElement('text'));
    addImageBtn.addEventListener('click', () => addElement('image'));
    addShapeBtn.addEventListener('click', () => addElement('shape'));
    addButtonBtn.addEventListener('click', () => addElement('button'));
    addPageBtn.addEventListener('click', addPage);
    undoBtn.addEventListener('click', undo);
    redoBtn.addEventListener('click', redo);
    deleteElementBtn.addEventListener('click', deleteSelectedElement);
    saveDesignBtn.addEventListener('click', saveDesign);
    loadDesignBtn.addEventListener('click', loadDesign);

    function addPage() {
        const pageNumber = pages.length + 1;
        const pageName = `Page ${pageNumber}`;
        pages.push(pageName);
        updatePageTabs();
        switchPage(pageName);
        addToHistory({ type: 'addPage', page: pageName });
    }

    function updatePageTabs() {
        pageTabs.innerHTML = '';
        pages.forEach(page => {
            const tab = document.createElement('div');
            tab.className = `page-tab ${page === currentPage ? 'active' : ''}`;
            tab.textContent = page;
            tab.addEventListener('click', () => switchPage(page));
            pageTabs.appendChild(tab);
        });
        pageTabs.appendChild(addPageBtn);
    }

    function switchPage(pageName) {
        currentPage = pageName;
        updatePageTabs();
        canvas.innerHTML = '';
        elements.filter(el => el.page === currentPage).forEach(el => canvas.appendChild(el.element));
        updateCodeView();
    }

    function addElement(type) {
        const element = document.createElement('div');
        element.className = 'element';
        element.style.left = '10px';
        element.style.top = '10px';
        element.dataset.id = Date.now().toString();

        if (type === 'text') {
            element.textContent = 'New Text';
        } else if (type === 'image') {
            const img = document.createElement('img');
            img.src = 'https://via.placeholder.com/150';
            img.style.width = '100%';
            img.style.height = '100%';
            element.appendChild(img);
        } else if (type === 'shape') {
            element.style.width = '100px';
            element.style.height = '100px';
            element.style.backgroundColor = 'blue';
        } else if (type === 'button') {
            element.textContent = 'Button';
            element.className += ' button-element';
        }

        const resizeHandle = document.createElement('div');
        resizeHandle.className = 'resize-handle';
        element.appendChild(resizeHandle);

        canvas.appendChild(element);
        elements.push({ element, page: currentPage });
        makeElementDraggable(element);
        makeElementResizable(element);
        selectElement(element);
        updateCodeView();
        addToHistory({ type: 'addElement', element: element.outerHTML, page: currentPage, elementId: element.dataset.id });
    }

    function makeElementDraggable(element) {
        element.addEventListener('mousedown', dragStart);

        function dragStart(e) {
            e.preventDefault();
            selectElement(element);

            const startX = e.clientX - element.offsetLeft;
            const startY = e.clientY - element.offsetTop;

            function drag(e) {
                let newX = e.clientX - startX;
                let newY = e.clientY - startY;

                const gridSizeValue = parseInt(gridSize.value);
                if (gridSizeValue > 0) {
                    newX = Math.round(newX / gridSizeValue) * gridSizeValue;
                    newY = Math.round(newY / gridSizeValue) * gridSizeValue;
                }

                element.style.left = `${newX}px`;
                element.style.top = `${newY}px`;
                updateCodeView();
            }

            function dragEnd() {
                document.removeEventListener('mousemove', drag);
                document.removeEventListener('mouseup', dragEnd);
                addToHistory({ type: 'moveElement', element: element.outerHTML, page: currentPage, elementId: element.dataset.id });
            }

            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', dragEnd);
        }
    }

    function makeElementResizable(element) {
        const resizeHandle = element.querySelector('.resize-handle');
        resizeHandle.addEventListener('mousedown', initResize);

        function initResize(e) {
            e.stopPropagation();
            const startX = e.clientX;
            const startY = e.clientY;
            const startWidth = parseInt(getComputedStyle(element).width, 10);
            const startHeight = parseInt(getComputedStyle(element).height, 10);

            function resize(e) {
                const newWidth = startWidth + e.clientX - startX;
                const newHeight = startHeight + e.clientY - startY;
                element.style.width = `${newWidth}px`;
                element.style.height = `${newHeight}px`;
                updateCodeView();
            }

            function stopResize() {
                document.removeEventListener('mousemove', resize);
                document.removeEventListener('mouseup', stopResize);
                addToHistory({ type: 'resizeElement', element: element.outerHTML, page: currentPage, elementId: element.dataset.id });
            }

            document.addEventListener('mousemove', resize);
            document.addEventListener('mouseup', stopResize);
        }
    }

    function selectElement(element) {
        if (selectedElement) {
            selectedElement.classList.remove('selected');
        }
        selectedElement = element;
        selectedElement.classList.add('selected');
        updateElementProperties();
    }

    function updateElementProperties() {
        if (selectedElement) {
            elementText.value = selectedElement.textContent;
            elementColor.value = rgb2hex(selectedElement.style.color || '#000000');
            elementFontSize.value = parseInt(selectedElement.style.fontSize) || 16;
            elementBgColor.value = rgb2hex(selectedElement.style.backgroundColor || '#ffffff');
            elementBorderRadius.value = parseInt(selectedElement.style.borderRadius) || 0;
            elementAnimation.value = selectedElement.dataset.animation || '';

            if (selectedElement.classList.contains('button-element')) {
                buttonProperties.classList.remove('hidden');
                buttonLink.value = selectedElement.dataset.link || '';
                buttonTarget.checked = selectedElement.dataset.target === '_blank';
            } else {
                buttonProperties.classList.add('hidden');
            }

            if (selectedElement.querySelector('img')) {
                imageProperties.classList.remove('hidden');
            } else {
                imageProperties.classList.add('hidden');
            }
        }
    }

    elementText.addEventListener('input', updateSelectedElement);
    elementColor.addEventListener('input', updateSelectedElement);
    elementFontSize.addEventListener('input', updateSelectedElement);
    elementBgColor.addEventListener('input', updateSelectedElement);
    elementBorderRadius.addEventListener('input', updateSelectedElement);
    elementAnimation.addEventListener('change', updateSelectedElement);
    buttonLink.addEventListener('input', updateSelectedElement);
    buttonTarget.addEventListener('change', updateSelectedElement);
    imageUpload.addEventListener('change', updateSelectedImage);

    function updateSelectedElement() {
        if (selectedElement) {
            selectedElement.textContent = elementText.value;
            selectedElement.style.color = elementColor.value;
            selectedElement.style.fontSize = elementFontSize.value + 'px';
            selectedElement.style.backgroundColor = elementBgColor.value;
            selectedElement.style.borderRadius = elementBorderRadius.value + 'px';
            
            selectedElement.className = selectedElement.className.replace(/animate__\S+/g, '');
            if (elementAnimation.value) {
                selectedElement.classList.add('animate__animated', `animate__${elementAnimation.value}`);
                selectedElement.dataset.animation = elementAnimation.value;
            } else {
                delete selectedElement.dataset.animation;
            }

            if (selectedElement.classList.contains('button-element')) {
                selectedElement.dataset.link = buttonLink.value;
                selectedElement.dataset.target = buttonTarget.checked ? '_blank' : '';
            }

            updateCodeView();
            addToHistory({ type: 'updateElement', element: selectedElement.outerHTML, page: currentPage, elementId: selectedElement.dataset.id });
        }
    }

    function updateSelectedImage(e) {
        if (selectedElement && selectedElement.querySelector('img')) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    selectedElement.querySelector('img').src = e.target.result;
                    updateCodeView();
                    addToHistory({ type: 'updateImage', element: selectedElement.outerHTML, page: currentPage, elementId: selectedElement.dataset.id });
                };
                reader.readAsDataURL(file);
            }
        }
    }

    function rgb2hex(rgb) {
        if (rgb.search("rgb") == -1) return rgb;
        rgb = rgb.match(/^rgba?$$(\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?$$$/);
        function hex(x) {
            return ("0" + parseInt(x).toString(16)).slice(-2);
        }
        return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
    }

    htmlTab.addEventListener('click', () => {
        currentCodeTab = 'html';
        updateCodeView();
    });

    cssTab.addEventListener('click', () => {
        currentCodeTab = 'css';
        updateCodeView();
    });

    jsTab.addEventListener('click', () => {
        currentCodeTab = 'js';
        updateCodeView();
    });

    function updateCodeView() {
        let code = '';
        if (currentCodeTab === 'html') {
            code = generateHTML();
        } else if (currentCodeTab === 'css') {
            code = generateCSS();
        } else if (currentCodeTab === 'js') {
            code = generateJS();
        }
        codeContent.textContent = code;
    }

    function generateHTML() {
        let html = '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Generated Website</title>\n  <link rel="stylesheet" href="styles.css">\n  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css">\n</head>\n<body>\n';
        
        pages.forEach(page => {
            html += `  <div id="${page.replace(' ', '')}" class="page"${page === currentPage ? '' : ' style="display: none;"'}>\n`;
            elements.filter(el => el.page === page).forEach((item, index) => {
                const element = item.element;
                html += `    <div id="element${index}" class="element${element.classList.contains('button-element') ? ' button-element' : ''}" style="left: ${element.style.left}; top: ${element.style.top}; width: ${element.style.width}; height: ${element.style.height};"`;
                if (element.dataset.animation) {
                    html += ` data-animation="${element.dataset.animation}"`;
                }
                if (element.classList.contains('button-element')) {
                    html += ` data-link="${element.dataset.link || ''}" data-target="${element.dataset.target || ''}"`;
                }
                html += `>${element.innerHTML}</div>\n`;
            });
            html += '  </div>\n';
        });
        
        html += '  <script src="script.js"></script>\n</body>\n</html>';
        return html;
    }

    function generateCSS() {
        let css = '.element {\n  position: absolute;\n  min-width: 50px;\n  min-height: 50px;\n}\n\n';
        elements.forEach((item, index) => {
            const element = item.element;
            css += `#element${index} {\n`;
            css += `  color: ${element.style.color};\n`;
            css += `  font-size: ${element.style.fontSize};\n`;
            css += `  background-color: ${element.style.backgroundColor};\n`;
            css += `  border-radius: ${element.style.borderRadius};\n`;
            css += '}\n\n';
        });
        return css;
    }

    function generateJS() {
        return `document.addEventListener('DOMContentLoaded', () => {
  const elements = document.querySelectorAll('.element');
  elements.forEach(element => {
    if (element.dataset.animation) {
      element.classList.add('animate__animated', \`animate__\${element.dataset.animation}\`);
    }
    if (element.classList.contains('button-element')) {
      element.addEventListener('click', () => {
        if (element.dataset.link) {
          window.open(element.dataset.link, element.dataset.target || '_self');
        }
      });
    }
  });

  // Add page navigation logic here if needed
});`;
    }

    function addToHistory(action) {
        actionHistory.push(action);
        actionFuture = [];
        updateUndoRedoButtons();
    }

    function undo() {
        if (actionHistory.length > 0) {
            const action = actionHistory.pop();
            actionFuture.push(action);
            applyAction(action, true);
            updateUndoRedoButtons();
        }
    }

    function redo() {
        if (actionFuture.length > 0) {
            const action = actionFuture.pop();
            actionHistory.push(action);
            applyAction(action, false);
            updateUndoRedoButtons();
        }
    }

    function applyAction(action, isUndo) {
        switch (action.type) {
            case 'addElement':
            case 'moveElement':
            case 'resizeElement':
            case 'updateElement':
            case 'updateImage':
                if (isUndo) {
                    const element = document.querySelector(`[data-id="${action.elementId}"]`);
                    if (element) element.remove();
                } else {
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = action.element;
                    canvas.appendChild(tempDiv.firstChild);
                }
                break;
            case 'addPage':
                if (isUndo) {
                    pages = pages.filter(page => page !== action.page);
                } else {
                    pages.push(action.page);
                }
                updatePageTabs();
                break;
            case 'deleteElement':
                if (isUndo) {
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = action.element;
                    canvas.appendChild(tempDiv.firstChild);
                } else {
                    const element = document.querySelector(`[data-id="${action.elementId}"]`);
                    if (element) element.remove();
                }
                break;
        }
        updateCodeView();
    }

    function updateUndoRedoButtons() {
        undoBtn.disabled = actionHistory.length === 0;
        redoBtn.disabled = actionFuture.length === 0;
    }

    function deleteSelectedElement() {
        if (selectedElement) {
            addToHistory({ type: 'deleteElement', element: selectedElement.outerHTML, page: currentPage, elementId: selectedElement.dataset.id });
            selectedElement.remove();
            selectedElement = null;
            updateElementProperties();
            updateCodeView();
        }
    }

    function saveDesign() {
        const design = {
            pages: pages,
            elements: elements.map(item => ({
                html: item.element.outerHTML,
                page: item.page
            }))
        };
        localStorage.setItem('savedDesign', JSON.stringify(design));
        alert('Design saved successfully!');
    }

    function loadDesign() {
        const savedDesign = localStorage.getItem('savedDesign');
        if (savedDesign) {
            const design = JSON.parse(savedDesign);
            pages = design.pages;
            elements = design.elements.map(item => ({
                element: createElementFromHTML(item.html),
                page: item.page
            }));
            updatePageTabs();
            switchPage(pages[0]);
            alert('Design loaded successfully!');
        } else {
            alert('No saved design found.');
        }
    }

    function createElementFromHTML(htmlString) {
        const div = document.createElement('div');
        div.innerHTML = htmlString.trim();
        return div.firstChild;
    }

    // Initialize the first page
    updatePageTabs();
});