const moment = require("moment");

module.exports = {
  truncate: function(str, len) {
    if (str.length > len && str.length > 0) {
      var new_str = str + " ";
      new_str = str.substr(0, len);
      new_str = str.substr(0, new_str.lastIndexOf(" "));
      new_str = new_str.length > 0 ? new_str : str.substr(0, len);
      return new_str + "...";
    }
    return str;
  },
  stripTags: function(input) {
    return input.replace(/<(?:.|\n)*?>/gm, "");
  },
  formatDate: function(date, format) {
    return moment(date).format(format);
  },
  select: function(selected, options) {
    return options
      .fn(this)
      .replace(new RegExp('value="' + selected + '"'), '$& selected="selected"')
      .replace(new RegExp(">" + selected + "</options"));
  },
  editIcon: function(postUser, loggedUser, postId, floating = true) {
    if (postUser === loggedUser) {
      if (floating) {
        return ` <a href="/edit/${postId}" class="btn-floating halfway-fab red" > 
                <i class="fa fa-pencil"></i>
                </a>`;
      } else {
        return ` <a href="/edit/${postId}">
                <i class="fa fa-pencil"></i>
                </a>`;
      }
    } else {
      return "";
    }
  },
  pagination: function(pages, current) {
    if (pages > 0) {
      if (current == 1) {
        return `<li class="disabled"><a>First</a></li>`;
      } else {
        return `<li class="disabled"><a href="/dashboard/>First</a></li>`;
      }
    }
  },
  formatTitle: (title, length) => {
    if (title.length > length) {
      return "<h4>" + title + "</h4>";
    } else {
      return "<h4>" + title + "</h4>";
    }
  }
};
