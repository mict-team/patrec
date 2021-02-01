import SecureLS from "secure-ls";
import Printd from "printd";

export const URL = "http://mict.local/patrec/api";
export const LS = new SecureLS({
  encodingType: "aes",
  isCompression: true,
  encryptionSecret: "wjehfufjir"
});
export const ValidateEmail = function(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};
export const APP = {
  name: "Patrec",
  logo: "../assets/logo.jpg",
  phone: "07051013383 | 08147846754",
  email: "adewumiadedeji27@gmail.com",
  version: "1.0.0",
  url: "http://patrec.com.ng/api/connect"
};

export const DATE2AGE = function(birthday) {
  var ageDifMs = Date.now() - birthday.getTime();
  var ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

export const AGE2DATE = function(age) {
  var today = new Date();
  var currentYear = today.getFullYear();
  var birthYear = currentYear - age;
  return birthYear;
};

// first we use encodeURIComponent to get percent-encoded UTF-8,
// then we convert the percent encodings into raw bytes which
// can be fed into btoa.
export const compress = function(uncompressed) {
  "use strict";
  // Build the dictionary.
  var i,
    dictionary = {},
    c,
    wc,
    w = "",
    result = [],
    dictSize = 256;
  for (i = 0; i < 256; i += 1) {
    dictionary[String.fromCharCode(i)] = i;
  }

  for (i = 0; i < uncompressed.length; i += 1) {
    c = uncompressed.charAt(i);
    wc = w + c;
    //Do not use dictionary[wc] because javascript arrays
    //will return values for array['pop'], array['push'] etc
    // if (dictionary[wc]) {
    if (dictionary.hasOwnProperty(wc)) {
      w = wc;
    } else {
      result.push(dictionary[w]);
      // Add wc to the dictionary.
      dictionary[wc] = dictSize++;
      w = String(c);
    }
  }

  // Output the code for w.
  if (w !== "") {
    result.push(dictionary[w]);
  }
  return result;
};

export const decompress = function(compressed) {
  "use strict";
  // Build the dictionary.
  var i,
    dictionary = [],
    w,
    result,
    k,
    entry = "",
    dictSize = 256;
  for (i = 0; i < 256; i += 1) {
    dictionary[i] = String.fromCharCode(i);
  }

  w = String.fromCharCode(compressed[0]);
  result = w;
  for (i = 1; i < compressed.length; i += 1) {
    k = compressed[i];
    if (dictionary[k]) {
      entry = dictionary[k];
    } else {
      if (k === dictSize) {
        entry = w + w.charAt(0);
      } else {
        return null;
      }
    }

    result += entry;

    // Add w+entry[0] to the dictionary.
    dictionary[dictSize++] = w + entry.charAt(0);

    w = entry;
  }
  return result;
};
/**
 * Secure Hash Algorithm (SHA256)
 * http://www.webtoolkit.info/
 * Original code by Angel Marin, Paul Johnston
 **/

export const SHA256 = function(s) {
  var chrsz = 8;
  var hexcase = 0;

  function safe_add(x, y) {
    var lsw = (x & 0xffff) + (y & 0xffff);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xffff);
  }

  function S(X, n) {
    return (X >>> n) | (X << (32 - n));
  }
  function R(X, n) {
    return X >>> n;
  }
  function Ch(x, y, z) {
    return (x & y) ^ (~x & z);
  }
  function Maj(x, y, z) {
    return (x & y) ^ (x & z) ^ (y & z);
  }
  function Sigma0256(x) {
    return S(x, 2) ^ S(x, 13) ^ S(x, 22);
  }
  function Sigma1256(x) {
    return S(x, 6) ^ S(x, 11) ^ S(x, 25);
  }
  function Gamma0256(x) {
    return S(x, 7) ^ S(x, 18) ^ R(x, 3);
  }
  function Gamma1256(x) {
    return S(x, 17) ^ S(x, 19) ^ R(x, 10);
  }

  function core_sha256(m, l) {
    var K = new Array(
      0x428a2f98,
      0x71374491,
      0xb5c0fbcf,
      0xe9b5dba5,
      0x3956c25b,
      0x59f111f1,
      0x923f82a4,
      0xab1c5ed5,
      0xd807aa98,
      0x12835b01,
      0x243185be,
      0x550c7dc3,
      0x72be5d74,
      0x80deb1fe,
      0x9bdc06a7,
      0xc19bf174,
      0xe49b69c1,
      0xefbe4786,
      0xfc19dc6,
      0x240ca1cc,
      0x2de92c6f,
      0x4a7484aa,
      0x5cb0a9dc,
      0x76f988da,
      0x983e5152,
      0xa831c66d,
      0xb00327c8,
      0xbf597fc7,
      0xc6e00bf3,
      0xd5a79147,
      0x6ca6351,
      0x14292967,
      0x27b70a85,
      0x2e1b2138,
      0x4d2c6dfc,
      0x53380d13,
      0x650a7354,
      0x766a0abb,
      0x81c2c92e,
      0x92722c85,
      0xa2bfe8a1,
      0xa81a664b,
      0xc24b8b70,
      0xc76c51a3,
      0xd192e819,
      0xd6990624,
      0xf40e3585,
      0x106aa070,
      0x19a4c116,
      0x1e376c08,
      0x2748774c,
      0x34b0bcb5,
      0x391c0cb3,
      0x4ed8aa4a,
      0x5b9cca4f,
      0x682e6ff3,
      0x748f82ee,
      0x78a5636f,
      0x84c87814,
      0x8cc70208,
      0x90befffa,
      0xa4506ceb,
      0xbef9a3f7,
      0xc67178f2
    );
    var HASH = new Array(
      0x6a09e667,
      0xbb67ae85,
      0x3c6ef372,
      0xa54ff53a,
      0x510e527f,
      0x9b05688c,
      0x1f83d9ab,
      0x5be0cd19
    );
    var W = new Array(64);
    var a, b, c, d, e, f, g, h, i, j;
    var T1, T2;

    m[l >> 5] |= 0x80 << (24 - (l % 32));
    m[(((l + 64) >> 9) << 4) + 15] = l;

    for (var i = 0; i < m.length; i += 16) {
      a = HASH[0];
      b = HASH[1];
      c = HASH[2];
      d = HASH[3];
      e = HASH[4];
      f = HASH[5];
      g = HASH[6];
      h = HASH[7];

      for (var j = 0; j < 64; j++) {
        if (j < 16) W[j] = m[j + i];
        else
          W[j] = safe_add(
            safe_add(
              safe_add(Gamma1256(W[j - 2]), W[j - 7]),
              Gamma0256(W[j - 15])
            ),
            W[j - 16]
          );

        T1 = safe_add(
          safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]),
          W[j]
        );
        T2 = safe_add(Sigma0256(a), Maj(a, b, c));

        h = g;
        g = f;
        f = e;
        e = safe_add(d, T1);
        d = c;
        c = b;
        b = a;
        a = safe_add(T1, T2);
      }

      HASH[0] = safe_add(a, HASH[0]);
      HASH[1] = safe_add(b, HASH[1]);
      HASH[2] = safe_add(c, HASH[2]);
      HASH[3] = safe_add(d, HASH[3]);
      HASH[4] = safe_add(e, HASH[4]);
      HASH[5] = safe_add(f, HASH[5]);
      HASH[6] = safe_add(g, HASH[6]);
      HASH[7] = safe_add(h, HASH[7]);
    }
    return HASH;
  }

  function str2binb(str) {
    var bin = Array();
    var mask = (1 << chrsz) - 1;
    for (var i = 0; i < str.length * chrsz; i += chrsz) {
      bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - (i % 32));
    }
    return bin;
  }

  function Utf8Encode(string) {
    string = string.replace(/\r\n/g, "\n");
    var utftext = "";

    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n);

      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if (c > 127 && c < 2048) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      } else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }
    }

    return utftext;
  }

  function binb2hex(binarray) {
    var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
    var str = "";
    for (var i = 0; i < binarray.length * 4; i++) {
      str +=
        hex_tab.charAt((binarray[i >> 2] >> ((3 - (i % 4)) * 8 + 4)) & 0xf) +
        hex_tab.charAt((binarray[i >> 2] >> ((3 - (i % 4)) * 8)) & 0xf);
    }
    return str;
  }

  s = Utf8Encode(s);
  return binb2hex(core_sha256(str2binb(s), s.length * chrsz));
};
export const IDGenerator = function(args) {
  var leng = args ? args : 8;
  var timestamp = +new Date();
  //console.log(leng)
  function _getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function generate() {
    var ts = timestamp.toString();
    var parts = ts.split("").reverse();
    var id = "";

    for (var i = 0; i < leng; ++i) {
      var index = _getRandomInt(0, parts.length - 1);
      id += parts[index];
    }
    return id;
  }

  return generate();
};

export const ALPHASTR = function(arr) {
  var ans = "";
  for (var i = 8; i > 0; i--) {
    ans += arr[Math.floor(Math.random() * arr.length)];
  }
  return ans;
};

export const toCurrency = function(number, decPlaces, decSep, thouSep) {
  (decPlaces = isNaN((decPlaces = Math.abs(decPlaces))) ? 2 : decPlaces),
    (decSep = typeof decSep === "undefined" ? "." : decSep);
  thouSep = typeof thouSep === "undefined" ? "," : thouSep;
  var sign = number < 0 ? "-" : "";
  var i = String(
    parseInt((number = Math.abs(Number(number) || 0).toFixed(decPlaces)))
  );
  var j = (j = i.length) > 3 ? j % 3 : 0;

  return (
    sign +
    (j ? i.substr(0, j) + thouSep : "") +
    i.substr(j).replace(/(\decSep{3})(?=\decSep)/g, "$1" + thouSep) +
    (decPlaces
      ? decSep +
        Math.abs(number - i)
          .toFixed(decPlaces)
          .slice(2)
      : "")
  );
};
function convertArrayOfObjectsToCSV(args) {
  var result, ctr, keys, columnDelimiter, lineDelimiter, data;

  data = args.data || null;
  if (data == null || !data.length) {
    return null;
  }

  columnDelimiter = args.columnDelimiter || ",";
  lineDelimiter = args.lineDelimiter || "\n";

  keys = Object.keys(data[0]);

  result = "";
  result += keys.join(columnDelimiter);
  result += lineDelimiter;

  data.forEach(function(item) {
    ctr = 0;
    keys.forEach(function(key) {
      if (ctr > 0) result += columnDelimiter;

      result += item[key];
      ctr++;
    });
    result += lineDelimiter;
  });

  return result;
}

export const DownloadCSV = function(args) {
  var data, filename, link;

  var csv = convertArrayOfObjectsToCSV({
    data: args.data
  });
  if (csv == null) return;

  filename = args.filename || "export.csv";

  if (!csv.match(/^data:text\/csv/i)) {
    csv = "data:text/csv;charset=utf-8," + csv;
  }
  data = encodeURI(csv);

  link = document.createElement("a");
  link.setAttribute("href", data);
  link.setAttribute("download", filename);
  link.click();
};

export const PrintPage= function(args) {
  //window.print();
  let stylesHtml = "";
  for (const node of [
      ...document.querySelectorAll('link[rel="stylesheet"], style')
  ]) {
      stylesHtml += node.outerHTML;
  }

  const prtHtml = document.getElementById(args).innerHTML;
  var content = `<!DOCTYPE html>
              <html>
              <head>
                  ${stylesHtml}
              </head>
              <body>
                  ${prtHtml}
              </body>
              </html>`;
    let printWindow = window.open('', '', 'height=200,width=400');  
    printWindow.document.write(content);  
    printWindow.document.close();  
    printWindow.print();
};
export const OS = function() {
  var userAgent = window.navigator.userAgent,
    platform = window.navigator.platform,
    macosPlatforms = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"],
    windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"],
    iosPlatforms = ["iPhone", "iPad", "iPod"],
    os = null;

  if (macosPlatforms.indexOf(platform) !== -1) {
    os = "Mac";
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    os = "iOS";
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    os = "Windows";
  } else if (/Android/.test(userAgent)) {
    os = "Android";
  } else if (!os && /Linux/.test(platform)) {
    os = "Linux";
  }

  return os;
};
