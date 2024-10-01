$.getJSON("menu.json", function(json) {
    console.log(json)
    let menuHtml = "";
    if(json.length>0) {
        json.forEach(menu => {
            console.log(menu);
            if(menu.type==="static") {
                menuHtml+=`<li class="menu-header small text-uppercase">
                <span class="menu-header-text">${menu.title}</span>
                </li>`;
            }else {

                menuHtml+=`<li class="menu-item ${menu.active==activeMenu?'open active':''}">
                <a href="${(menu.link!=="")?menu.link:'javascript:void(0);'}" class="menu-link ${menu.submenu.length>0?'menu-toggle':''}">
                  <i class="menu-icon tf-icons bx ${menu.icon}"></i>
                  <div data-i18n="Analytics">${menu.title}</div>
                </a>`;
                if(menu.submenu.length>0) {
                    menuHtml+=`<ul class="menu-sub">`;
                    menu.submenu.forEach(submenu => {
                        menuHtml+=`<li class="menu-item">
                        <a href="${submenu.link}" class="menu-link ${submenu.active===activesub?'active':''}">
                            <div data-i18n="Account">${submenu.title}</div>
                        </a>
                        </li>`;
                    });
                    menuHtml+=`</ul>`;
                }
                 menuHtml+=`
              </li>
              `;
            }
        })
        menuHtml+=`<li class="d-flex justify-content-center align-items-center m-4">
                <a class="dropdown-item btn text-danger text-center" id="logout">
                <i class="bx bx-power-off me-0 "></i>
                <span class="align-middle">Log Out</span>
                </a>
              </li>`;
    }
    $('#menuList').append(menuHtml);
     // this will show the info it in firebug console
});