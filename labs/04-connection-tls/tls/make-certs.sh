#!/bin/sh
# یک CA آزمایشی و یک گواهی برای shop.test می‌سازد (فقط برای کلاس؛ کلیدها را جای دیگری به کار نبرید).
#   sh tls/make-certs.sh   →  tls/certs/{ca.pem, ca.key, shop.pem, shop.key}
set -e
d="$(dirname "$0")/certs"; mkdir -p "$d"; cd "$d"
openssl req -x509 -newkey ec -pkeyopt ec_paramgen_curve:P-256 -nodes -days 30 \
  -keyout ca.key -out ca.pem -subj "/CN=IE Class Test CA" \
  -addext "basicConstraints=critical,CA:TRUE" -addext "keyUsage=critical,keyCertSign" 2>/dev/null
openssl req -newkey ec -pkeyopt ec_paramgen_curve:P-256 -nodes \
  -keyout shop.key -out shop.csr -subj "/CN=shop.test" 2>/dev/null
printf 'subjectAltName=DNS:shop.test\nbasicConstraints=CA:FALSE\nextendedKeyUsage=serverAuth\n' > shop.ext
openssl x509 -req -in shop.csr -CA ca.pem -CAkey ca.key -CAcreateserial -days 7 -extfile shop.ext -out shop.pem 2>/dev/null
rm -f shop.csr shop.ext ca.srl
echo "ساخته شد: $d"
