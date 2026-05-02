const RAJAONGKIR_API_KEY = process.env.RAJAONGKIR_API_KEY;
const RAJAONGKIR_BASE_URL = 'https://api.rajaongkir.com/starter'; // Gunakan 'pro' jika Anda punya akun Pro

export async function getProvinces() {
  const res = await fetch(`${RAJAONGKIR_BASE_URL}/province`, {
    headers: { 'key': RAJAONGKIR_API_KEY! }
  });
  const data = await res.json();
  return data.rajaongkir.results;
}

export async function getCities(provinceId: string) {
  const res = await fetch(`${RAJAONGKIR_BASE_URL}/city?province=${provinceId}`, {
    headers: { 'key': RAJAONGKIR_API_KEY! }
  });
  const data = await res.json();
  return data.rajaongkir.results;
}

export async function calculateShipping(destination: string, weight: number, courier: string) {
  const res = await fetch(`${RAJAONGKIR_BASE_URL}/cost`, {
    method: 'POST',
    headers: {
      'key': RAJAONGKIR_API_KEY!,
      'content-type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      origin: '105', // Contoh ID Kota Boyolali (Sesuaikan dengan gudang Anda)
      destination: destination,
      weight: weight.toString(),
      courier: courier
    })
  });
  const data = await res.json();
  return data.rajaongkir.results[0].costs;
}
