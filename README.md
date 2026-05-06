# Huong Dan Cai Dat Website On Tap Dung/Sai

Website nay la ung dung static HTML/CSS/JavaScript de on tap cau hoi Dung/Sai tu tai lieu tieng Nhat. Du lieu cau hoi, audio va anh PDF da nam san trong thu muc `study-site`.

## 1. Yeu Cau

- May tinh co trinh duyet hien dai: Chrome, Safari, Edge hoac Firefox.
- Nen co Python 3 neu muon chay bang local server.
- Khong can cai Node.js, npm hay database.

## 2. Cau Truc Thu Muc

```text
study-site/
├── index.html
├── styles.css
├── app.js
├── data.js
├── README.md
└── assets/
    ├── audio/
    └── pages/
```

- `index.html`: giao dien chinh.
- `styles.css`: dinh dang giao dien.
- `app.js`: xu ly chon de, chuyen cau, cham diem, audio tu vung.
- `data.js`: du lieu de thi, cau hoi, dap an, romaji, dich va giai thich.
- `assets/audio`: audio tung cau.
- `assets/pages`: anh goc tu PDF.

## 3. Cach Mo Nhanh

Co the mo truc tiep file:

```text
/Users/havietco/Documents/Codex/2026-05-03/files-web/study-site/index.html
```

Neu mo truc tiep bang `file://`, website van co the hoc va lam cau hoi. Tuy nhien, cach khuyen nghi la chay local server o muc ben duoi de audio va file tinh hoat dong on dinh hon.

## 4. Cach Chay Bang Local Server

Mo Terminal va chay:

```bash
cd /Users/havietco/Documents/Codex/2026-05-03/files-web/study-site
python3 -m http.server 4173
```

Sau do mo trinh duyet:

```text
http://127.0.0.1:4173/
```

Neu cong `4173` dang ban, co the doi sang cong khac:

```bash
python3 -m http.server 8080
```

Va mo:

```text
http://127.0.0.1:8080/
```

## 5. Cach Su Dung

- Chon de trong o `Chon de`.
- Bam `Dung` hoac `Sai` de tra loi.
- Bam `Cau truoc` / `Cau tiep` hoac dung phim mui ten `←` / `→` de chuyen cau.
- Bam nut audio cua cau de nghe ca cau tieng Nhat.
- Bam nut `▶` trong tung tu vung de nghe rieng tu do.
- Xem romaji, dich tieng Viet, giai thich va anh goc tu PDF o moi cau.

## 6. Noi Dung Hien Co

- De 1: 20 cau, trang 1-2.
- De 2: 20 cau, trang 3-4.
- De 3: 20 cau, trang 5-6.
- De 4: 20 cau, trang 7-8.
- De 5 / 2008-A: 15 cau, trang 9-10.
- De 6: 20 cau, trang 11-12.

Tong cong: 115 cau.

## 7. Sua Hoac Bo Sung Cau Hoi

Mo file:

```text
data.js
```

Moi cau co dang:

```js
{
  id: 1,
  page: 1,
  jp: "これは さげふりです。",
  romaji: "Kore wa sagefuri desu.",
  vi: "Day la qua doi.",
  answer: true,
  reason: "Giai thich dap an."
}
```

Quy uoc:

- `answer: true` la dap an Dung.
- `answer: false` la dap an Sai.
- `page` la trang anh PDF tuong ung trong `assets/pages`.

## 8. Loi Thuong Gap

- Khong nghe duoc audio cau: hay chay bang local server thay vi mo truc tiep file.
- Khong nghe duoc audio tu vung: trinh duyet can ho tro `speechSynthesis`; Safari hoac Chrome tren macOS thuong ho tro tot.
- Anh PDF khong hien: kiem tra thu muc `assets/pages` con du file `page_01.jpg` den `page_12.jpg`.
- Audio cau khong hien: kiem tra thu muc `assets/audio` con cac file `.m4a`.

## 9. Ghi Chu

Day la website static, co the copy ca thu muc `study-site` sang may khac va chay lai bang cach tuong tu.
