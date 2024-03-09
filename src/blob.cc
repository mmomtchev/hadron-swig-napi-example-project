#include "blob.h"
#include <stdexcept>
#include <string.h>
#ifdef HAVE_ZLIB
#include <zlib.h>
#endif

Blob::Blob() : data_(nullptr), len_(0) {}

Blob::Blob(size_t len) : len_(len) {
  data_ = new uint8_t[len_];
}

Blob::Blob(uint8_t *data, size_t len) : len_(len) {
  data_ = new uint8_t[len_];
  memcpy(data_, data, len_);
}

Blob::Blob(const Blob &other) : Blob(other.data_, other.len_) {}

void Blob::Fill(uint8_t value) {
  memset(data_, value, len_);
}

void Blob::Export(uint8_t **data, size_t *len) {
  *data = new uint8_t[len_];
  memcpy(*data, data_, len_);
  *len = len_;
}

void Blob::Write(uint8_t *data, size_t len) {
  if (len != len_) throw std::logic_error{"Sizes must match"};
  memcpy(data, data_, len_);
}

void Blob::Decompress() {
#ifdef HAVE_ZLIB
  z_stream strm;
  strm.zalloc = Z_NULL;
  strm.zfree = Z_NULL;
  strm.opaque = Z_NULL;
  strm.avail_in = len_;
  strm.next_in = data_;
  auto output = new uint8_t[len_];
  strm.avail_out = len_;
  strm.next_out = output;
  int r = inflateInit(&strm);
  if (r != Z_OK) throw std::runtime_error{"Failed to initialize inflate"};
  r = inflate(&strm, Z_NO_FLUSH);
  if (r == Z_STREAM_ERROR) throw std::logic_error{"Invalid data"};
  inflateEnd(&strm);
  delete[] data_;
  data_ = output;
  len_ = len_ - strm.avail_out;
#else
  throw std::runtime_error{"No zlib support"};
#endif
}

Blob::~Blob() {
  delete[] data_;
}
