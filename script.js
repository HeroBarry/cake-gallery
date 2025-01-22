let currentCategory = 'all';

// 加载数据并初始化页面
async function initPage() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        
        // 初始化分类菜单
        initCategories(data.categories);
        
        // 显示图片
        displayImages(data.images, currentCategory);
        
        // 设置分类按钮点击事件
        setupCategoryButton();
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// 初始化分类菜单
function initCategories(categories) {
    const categoryMenu = document.getElementById('categoryMenu');
    
    categories.forEach(category => {
        const categoryItem = document.createElement('div');
        categoryItem.className = 'category-item';
        categoryItem.textContent = category.name;
        categoryItem.dataset.category = category.id;
        
        categoryItem.addEventListener('click', (e) => {
            e.stopPropagation(); // 阻止事件冒泡
            currentCategory = category.id;
            displayImages(window.allImages, currentCategory);
            // 使用父元素引用来隐藏菜单
            categoryItem.parentElement.classList.remove('active');
            // 平滑滚动到顶部
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        categoryMenu.appendChild(categoryItem);
    });
}

// 添加懒加载功能
function setupLazyLoading() {
    const options = {
        root: null,
        rootMargin: '50px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                observer.unobserve(img);
            }
        });
    }, options);

    return observer;
}

// 修改显示图片函数
function displayImages(images, category) {
    window.allImages = images;
    const waterfall = document.getElementById('waterfall');
    waterfall.innerHTML = '';
    
    const filteredImages = category === 'all' 
        ? images 
        : images.filter(img => img.category === category);
    
    const observer = setupLazyLoading();
    
    filteredImages.forEach(image => {
        const imageItem = document.createElement('div');
        imageItem.className = 'image-item';
        
        // 添加图片编号
        const imageNumber = document.createElement('div');
        imageNumber.className = 'image-number';
        imageNumber.textContent = `#${image.id}`;
        imageItem.appendChild(imageNumber);
        
        const img = document.createElement('img');
        img.dataset.src = image.url; // 使用 data-src 存储真实图片地址
        img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; // 占位图
        img.alt = image.title || '';
        
        observer.observe(img); // 观察图片元素
        
        // 添加点击事件
        imageItem.addEventListener('click', () => showProductInfo(image));
        
        imageItem.appendChild(img);
        waterfall.appendChild(imageItem);
    });
}

// 显示产品信息
function showProductInfo(product) {
    const modal = document.getElementById('productModal');
    const productInfo = document.getElementById('productInfo');
    
    let pricesHTML = product.prices.map(p => `
        <div class="price-item">
            <span>${p.spec}</span>
            <span>￥${p.price}</span>
        </div>
    `).join('');

    productInfo.innerHTML = `
        <h3>${product.title} 编号: ${product.id}</h3>
        <div class="price-list">
            <h3>价格信息：</h3>
            ${pricesHTML}
        </div>
        <p>备注: ${product.notes || '暂无备注'}</p>
    `;
    
    modal.style.display = 'flex';
}

// 关闭模态框
function setupModal() {
    const modal = document.getElementById('productModal');
    const closeBtn = document.getElementById('closeModal');
    
    closeBtn.onclick = function() {
        modal.style.display = 'none';
    }
    
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
}

// 设置分类按钮点击事件
function setupCategoryButton() {
    const categoryBtn = document.getElementById('categoryBtn');
    const categoryMenu = document.getElementById('categoryMenu');
    
    // 阻止分类菜单的点击事件冒泡
    categoryMenu.addEventListener('click', (e) => {
        e.stopPropagation();
    });
    
    categoryBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        categoryMenu.classList.toggle('active');
    });
    
    // 点击其他地方关闭菜单
    document.addEventListener('click', () => {
        categoryMenu.classList.remove('active');
    });
}

// 在页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    initPage();
    setupModal();
}); 
