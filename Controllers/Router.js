// Controllers/router.js

// Nạp 1 file html vào 1 vị trí (id) trong index.html
async function loadView(path, targetId) {
    const target = document.getElementById(targetId);
    try {
        const res = await fetch(path);
        if (!res.ok) throw new Error("HTTP " + res.status);
        target.innerHTML = await res.text();
    } catch (err) {
        target.innerHTML =
            "<p class='p-6 text-center text-rose-400'>Không tải được: " + path + "</p>";
        console.error("Lỗi nạp view:", path, err);
    }
}

// Switch case quyết định hiển thị view nào
function route() {
    // Bỏ qua link neo trong trang như #danh-muc, #pc-cau-hinh, #showroom
    if (location.hash && !location.hash.startsWith("#/")) return;

    const page = location.hash.replace("#/", "") || "home";

    switch (page) {
        case "home":
            loadView("Views/layout/home.html", "app");
            break;

        // Thêm trang mới thì thêm case ở đây, ví dụ:
        // case "san-pham":
        //     loadView("Views/layout/san-pham.html", "app");
        //     break;

        default:
            document.getElementById("app").innerHTML =
                "<h1 class='p-10 text-center text-2xl font-bold'>404 - Không tìm thấy trang</h1>";
    }

    window.scrollTo(0, 0);
}

// Header và footer chỉ nạp 1 lần
loadView("Views/layout/header.html", "header");
loadView("Views/layout/footer.html", "footer");

// Chạy khi mở trang và mỗi khi đổi đường dẫn
window.addEventListener("hashchange", route);
route();