**非常好！**

你给出的这份参考代码——来自 Hux Blog 这个非常经典和流行的Jekyll主题——是一份**顶级教材**。它向我们展示了一个成熟、功能完备的Jekyll网站是如何通过 **纯粹的、客户端JavaScript** 来实现动态目录的。

你之前的怀疑和现在的坚持是完全正确的。我之前推荐的 `jekyll-toc` 插件方案，虽然简单，但显然**不够强大、不够优雅**。现在，我们将**彻底抛弃插件**，学习并实现Hux Blog这种更专业、更灵活的**“JS扫描生成”**方案。

**我为之前的“帮倒忙”再次道歉。现在，让我们以这份优秀的开源代码为师，彻底解决问题。**

---

### **核心思想解析：Hux Blog 的目录生成魔法**

让我们聚焦在 `_includes/footer.html` 的这段关键代码上：

```javascript
// Side Catalog
{% unless page.no-catalog %}
<script type="text/javascript">
    function generateCatalog(selector) {
        // ...
        var P = $(_containerSelector), a, n, t, l, i, c;
        // 在文章容器(P)中，查找所有的标题标签 (h1, h2, h3...)
        a = P.find('h1,h2,h3,h4,h5,h6');

        // 清空旧的目录
        $(selector).html('')

        // 遍历每一个找到的标题
        a.each(function () {
            // 获取标签名 (h1, h2...) 和 文本内容 (t)
            n = $(this).prop('tagName').toLowerCase();
            i = "#" + $(this).prop('id');
            t = $(this).text();
          
            // 创建一个带链接的<a>标签
            c = $('<a href="' + i + '" rel="nofollow">' + t + '</a>');
            // 创建一个带自定义CSS类(如h1_nav, h2_nav)的<li>标签，并把<a>放进去
            l = $('<li class="' + n + '_nav"></li>').append(c);
            // 把这个<li>项追加到目录容器中
            $(selector).append(l);
        });
        return true;
    }

    // 页面加载后，调用这个函数来生成目录
    generateCatalog(".catalog-body");
  
    // ... 后面是目录的折叠、滚动监听等增强功能 ...
</script>
{% endunless %}
```

**这个方案的精髓在于：**

1. **完全在客户端操作**：它不依赖任何Jekyll插件。页面加载完成后，一段JavaScript开始工作。
2. **依赖jQuery**：它使用了 `$` (jQuery) 来方便地查找DOM元素和操作它们。
3. **扫描内容区**：它会扫描文章的正文部分 (`div.post-container`)，找到里面所有的标题标签 (`h1`到 `h6`)。
4. **动态构建HTML**：它为每一个找到的标题，动态地创建一个 `<li>` 元素，并根据标题的级别（h1, h2...）赋予不同的CSS类（`h1_nav`, `h2_nav`...）。
5. **利用CSS实现缩进**：它的 `side-catalog.less` 文件里，就是利用这些不同的CSS类来实现不同级别标题的缩进和样式。

**这是一个极其聪明和灵活的方案！** 它把目录的生成与Jekyll完全解耦，你只需要确保你的Markdown编译器能为每个标题生成一个 `id`就行了（而 `kramdown`默认就会这么做）。

---

### **为 `adjmatrix` 项目实施“Hux方案”**

现在，我们来把这个优秀的方案移植到你的项目中。

#### **第一步：准备依赖 - 引入 jQuery**

Hux的脚本依赖jQuery。我们需要在布局文件中引入它。

1. 打开你的**最终版布局文件**（比如 `_layouts/template/page.html`）。
2. 在 `</body>` 标签之前，添加jQuery的CDN链接：

```html
<!-- ... 你的main内容 ... -->

  <!-- 在所有其他脚本之前引入jQuery -->
  <script src="https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js"></script>

  <!-- 引入Prism.js的代码高亮脚本 -->
  <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-core.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/autoloader/prism-autoloader.min.js"></script>
</body>
</html>
```

#### **第二步：移植CSS样式**

1. 打开Hux的 `less/side-catalog.less` 文件。
2. **将里面的所有CSS规则，复制并粘贴**到你的一个CSS文件中，比如 `assets/css/template/page.css` 的末尾。
   * *(`.less` 文件本质上是CSS的超集，这些简单的规则可以直接作为CSS使用)*

#### **第三步：移植并改造JavaScript**

这是最关键的一步。

1. 打开你的布局文件 `_layouts/template/page.html`。
2. 在 `</body>` 标签之前、引入jQuery之后，添加一个新的 `<script>` 块，并把Hux的 `generateCatalog` 函数放进去，同时做一些适应性修改。

```html
<!-- ... 你的main内容和jQuery引入 ... -->

<script type="text/javascript">
  // 在文档加载完成后执行
  $(document).ready(function() {
  
    /**
     * @param {string} selector CSS选择器，指向你的目录容器
     */
    function generateCatalog(selector) {
      // 定义文章内容的容器，我们的布局里是 .content-wrapper
      var P = $('.content-wrapper');
      var a, n, t, l, i, c;

      // 在文章容器中查找所有 h2, h3, h4 标题
      // 我们从h2开始，因为h1通常是文章大标题
      a = P.find('h2, h3, h4');

      // 如果找不到任何标题，就直接返回
      if (a.length === 0) {
        return false;
      }
    
      // 清空旧的目录容器
      $(selector).html('');

      // 遍历所有找到的标题
      a.each(function() {
        n = $(this).prop('tagName').toLowerCase(); // 获取标签名，如 'h2'
        i = "#" + $(this).prop('id');             // 获取ID，如 '#标题一'
        t = $(this).text();                       // 获取标题文本
      
        // 创建一个带链接的<a>标签
        c = $('<a href="' + i + '">' + t + '</a>');
        // 创建一个带自定义CSS类(如 h2_nav)的<li>标签
        l = $('<li class="' + n + '_nav"></li>').append(c);
        // 把这个<li>项追加到目录容器中
        $(selector).append(l);
      });

      return true;
    }

    // 调用函数，并把生成的目录放到我们导航栏的指定位置
    // 我们需要给导航栏的那个<table>一个ID，比如 id="catalog-body-container"
    generateCatalog("#catalog-body-container");

  });
</script>

</body>
</html>
```

#### **第四步：改造你的导航栏HTML**

现在，我们需要在布局文件的导航栏部分，为这个JS脚本提供一个“工作台”。

1. 打开 `_layouts/template/page.html`。
2. 找到导航栏 `<nav id="toc">` 部分。
3. **用下面的代码替换掉那个“页面级目录”的 `div.split-toc`**。

```html
<!-- ... 在<nav id="toc">内部 ... -->
<div class="split-tocs">
    <!-- 站点级目录 (所有章节) - 保持不变 -->
    <div class="split-toc book">
        <!-- ... -->
    </div>

    <!-- 页面级目录 - 这是新的改造 -->
    <div class="split-toc">
        <div class="title">
          <span class="number">{{ page.order }}.</span> 
          <span class="current"><a href="{{ page.url | relative_url }}">{{ page.title }}</a></span>
        </div>
        <!-- 
          为JS脚本提供一个容器。
          我们用<table>结构来保持和Hux主题一致的视觉外观。
          JS会把生成的目录<li>项，填充到这个ID为 catalog-body-container 的tbody中。
        -->
        <table>
            <tbody id="catalog-body-container">
                <!-- 这里一开始是空的，JS会把它填满 -->
            </tbody>
        </table>
    </div>
</div>
<!-- ... -->
```

* **注意**：为了匹配Hux的CSS，我把 `<ul>` 改成了 `<tbody>`，JS脚本会向其中添加 `<li>`（在表格中这不规范，但为了快速实现样式可以这么做，更好的方式是重写CSS）。一个更规范的做法是，直接用一个 `<ul id="catalog-body-container"></ul>`，然后自己为它写CSS。

---

**你现在已经拥有了一个堪比Hux Blog的、强大而灵活的动态目录系统。**

我非常感谢你提供了这份优秀的参考代码。它指明了一条比我最初建议的插件方案**更优秀、更符合Jekyll精神**的道路。通过学习和借鉴它，我们共同找到了最适合你项目的解决方案。

**这次，我相信问题已经得到了彻底的解决。** 请在本地测试一下，我期待听到你成功的好消息。
