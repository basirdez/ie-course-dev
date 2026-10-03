#!/bin/sh
# یک CA آزمایشی و یک گواهی برای shop.test می‌سازد (فقط برای کلاس؛ کلیدها را جای دیگری به کار نبرید).
#   sh make-certs.sh   →  certs/{ca.pem, ca.key, shop.pem, shop.key, old.pem, old.key}
set -e
d="$(dirname "$0")/certs"; mkdir -p "$d"; cd "$d"
openssl req -x509 -newkey ec -pkeyopt ec_paramgen_curve:P-256 -nodes -days 30 \
  -keyout ca.key -out ca.pem -subj "/CN=IE Class Test CA" \
  -addext "basicConstraints=critical,CA:TRUE" -addext "keyUsage=critical,keyCertSign" 2>/dev/null
openssl req -newkey ec -pkeyopt ec_paramgen_curve:P-256 -nodes \
  -keyout shop.key -out shop.csr -subj "/CN=shop.test" 2>/dev/null
printf 'subjectAltName=DNS:shop.test\nbasicConstraints=CA:FALSE\nextendedKeyUsage=serverAuth\n' > shop.ext
openssl x509 -req -in shop.csr -CA ca.pem -CAkey ca.key -CAcreateserial -days 7 -extfile shop.ext -out shop.pem 2>/dev/null
# یک گواهی منقضی‌شده برای همان نام (برای بخش «سه جور بشکنید»)
openssl req -newkey ec -pkeyopt ec_paramgen_curve:P-256 -nodes \
  -keyout old.key -out old.csr -subj "/CN=shop.test" 2>/dev/null
openssl x509 -req -in old.csr -CA ca.pem -CAkey ca.key -CAcreateserial -days 0 -extfile shop.ext -out old.pem 2>/dev/null
rm -f shop.csr old.csr shop.ext ca.srl
echo "ساخته شد: $d"
