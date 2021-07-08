var helper = {
  phantram: (a, b) => {
    var result = 100 - ((Number(a) / Number(b)) * 100);
    if (result > 0) {
      return "<div class='sale'>" + parseInt(result) + "% off</div>";
    }
  },
  compare: (a, b, c) => {

    if (b.localeCompare(a) == 0) {
      return "<option value='" + c + "' selected>" + a + "</option>";
    } else {

      return "<option value='" + c + "'>" + a + "</option>";
    }
  },
  forCount: (i, e) => {
    if (i == e) {
      return "<button class='color' type='submit' value='" + i + "' name='page'>" + i + "</button>"
    } else {
      return "<button type='submit' value='" + i + "' name='page'>" + i + "</button>"
    }
  },
  comparePrice: (a, b) => {
    if (a < b) {
      return "<span class='pr-f'>" + b + " $</span>";
    }
  },
  date: (a) => {
    var r = new Date(a);
    var date = r.getDate() + "-" + (r.getMonth() + 1) + "-" + r.getFullYear();
    return date;
  },
  checkRole: (a, b) => {
    if (a.includes(b)) {
      return "<div><input type='radio' checked name='role' value='" + b + "' id='" + b + "'><label for='" + b + "'>" + b + "</label> </div>"
    } else {
      return "<div><input type='radio' name='role' value='" + b + "' id='" + b + "'><label for='" + b + "'>" + b + "</label> </div>"
    }
  },

  checkPermission: (a, b, c, d) => {
    if (a.includes(b)) {
      var r = "<div>" +
        "<input type='checkbox' checked class='" + c + "' value='" + b + "' name='permission' id='" + b + "'>" +
        "<label for='" + b + "'>" + d + "</label>" +
        "</div>";
      return r;
    } else {
      var r = "<div>" +
        "<input type='checkbox' class='" + c + "' value='" + b + "' name='permission' id='" + b + "'>" +
        "<label for='" + b + "'>" + d + "</label>" +
        "</div>";
      return r;
    }
  },

  total_months: (a) => {
    var c = new Array;
    for (i = 0; i < 12; i++) {
      for (j = 0; j < a.length; j++) {
        if (a[j]._id.month == (i + 1)) {
          c[i] = a[j].total;
          break;
        } else {
          c[i] = 0;
        }
      }
    }
    return c;
  },

  total_year_helper: (a) => {
    var r = (Number(a) / 700000) * 100;
    var c = Math.round(r);
    return "<div class='mkCharts' data-percent='" + c + "' data-size='100'  data-stroke='2' data-color='#525ce5'></div>";
  }

}
module.exports = helper;