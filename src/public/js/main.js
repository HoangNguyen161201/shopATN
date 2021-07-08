$(document).ready(function () {


  document.querySelectorAll('input[type=checkbox]').forEach(e => {
    e.onclick = function () {
      var name = "." + e.className + '2';
      if (e.checked == true) {
        document.querySelectorAll(name).forEach(e => {
          e.checked = true;
        })
      } else {
        document.querySelectorAll(name).forEach(e => {
          e.checked = false;
        })
      }
    }
  })

  function formDelete(a, b, c) {
    var r = a.getAttribute('data-name');
    var y = a.getAttribute('data-id');
    document.querySelector('.dgcontent').innerHTML = b + r;
    document.querySelector(".bt-delete").href = c + y;
    $(".dialogms").css("display", "block");
  }
  document.querySelectorAll('.d-ct').forEach(e => {
    e.onclick = function () {
      var alert = "Delete all products belonging to ";
      var href = "/managerCategories/delete/";
      formDelete(this, alert, href);
    }
  })
  document.querySelectorAll('.d-cs').forEach(e => {
    e.onclick = function () {
      var alert = "delete customer whose name is ";
      var href = "/managerCustomers/delete/";
      formDelete(this, alert, href);
    }
  })
  document.querySelectorAll('.d-sp').forEach(e => {
    e.onclick = function () {
      var alert = "Delete all suppliers belonging to ";
      var href = "/managerSuppliers/delete/";
      formDelete(this, alert, href);
    }
  })
  document.querySelectorAll('.d-staff').forEach(e => {
    e.onclick = function () {
      var alert = "Delete account with name is ";
      var href = "/managerAccounts/delete/";
      formDelete(this, alert, href);
    }
  })
  $(".ic-delete").click(() => {
    $(".dialogms").css("display", "none");
  })
  $('.openBar').click(() => {
    if (window.innerWidth > 1000) {
      $('.main-bar').toggleClass('close');
      $('.mainLogo').toggleClass('scale');
      $('.name').toggleClass('close');
    } else {
      $('.main-bar').removeClass('close');
      $('.main-bar').toggleClass('left-0');
    }
  });
  $('.t-category').click(() => {
    $('.t-category').children('.down').toggleClass('rotate');
    $('.f-category').slideToggle(300);
  });
  $('.t-suplier').click(() => {
    $('.t-suplier').children('.down').toggleClass('rotate');
    $('.f-suplier').slideToggle(300);
  });


  $('.open-func').click(function () {
    $(this).children('.down').toggleClass('rotate');

    $(this).next().slideToggle(300);

  })
  document.getElementById('addfile').oninput = function () {
    var r = document.createElement('img');
    r.alt = "img";
    r.src = 'https://img.icons8.com/cute-clipart/64/000000/image-file.png';
    document.querySelector('.lable-file').appendChild(r);
  }
})
document.querySelectorAll(".click_pr").forEach(e => {
  e.onclick = function () {
    var product = e.parentElement;
    var id = product.childNodes[1].innerHTML;
    var name = product.childNodes[5].innerHTML;
    var quantity = product.childNodes[9].innerHTML;
    var checkExist = 0;
    document.querySelectorAll(".id-pr-choce").forEach(e => {
      if (e.innerHTML == id) {
        checkExist = 1;
      }
    })
    if (checkExist != 1) {
      var r = document.createElement("div");
      r.className = "product_c";
      r.innerHTML = "<div class='id-pr-choce'>" + id + "</div>" +
        "<div>" + name + "</div>" +
        "<div class='qt'>" +
        "<div class='qt_number'>" +
        "<input type='number' name='" + id.trim() + "' value='1' min='1' max='" + Number(quantity) + "' id=''>" +
        "</div>" +
        "</div>" +
        "<div class='delete_pr'>" +
        " <i onclick='delete_pr_choce(this)' class='fas fa-eraser huy'></i>" +
        "</div>";
      document.querySelector(".products_r").appendChild(r);
      document.querySelector(".products_r").style.display = "block";
    }
  }
})

function delete_pr_choce(e) {
  e.parentElement.parentElement.remove();
  document.querySelector(".products_r").innerHTML = document.querySelector(".products_r").innerHTML.trim();
  if (document.querySelector(".products_r").innerHTML == "") {
    document.querySelector(".products_r").style.display = "none";
  }
}
document.querySelectorAll(".click_ps").forEach(e => {
  e.onclick = function () {
    var parent = this.parentElement;
    document.querySelector('.customer_r').style.display = "flex";
    document.querySelector('.ps_id').innerHTML = parent.childNodes[1].innerHTML;
    document.querySelector('.ps_phone').innerHTML = parent.childNodes[5].innerHTML;
    document.querySelector('.ps_name').innerHTML = parent.childNodes[3].innerHTML;

  }
})



document.querySelector('.search_customer').oninput = function () {
  document.querySelectorAll(".name_customer").forEach(e => {
    if (e.innerHTML.toLowerCase().includes(document.querySelector('.search_customer').value.toLowerCase())) {
      e.parentElement.style.display = "flex";
    } else {
      e.parentElement.style.display = "none";
    }
  })
}
document.querySelector('.search_product').oninput = function () {
  document.querySelectorAll(".name_pr").forEach(e => {
    if (e.innerHTML.toLowerCase().includes(document.querySelector('.search_product').value.toLowerCase())) {
      e.parentElement.style.display = "flex";
    } else {
      e.parentElement.style.display = "none";
    }
  })
}