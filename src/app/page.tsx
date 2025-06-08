'use client';
import { useState } from 'react';

type Item = {
  PRD_ID: number;
  CODE: string;
  NAME: string;
  PRICE: number;
};

export default function Home() {
  const [code, setCode] = useState('');
  const [item, setItem] = useState<Item | null>(null);
  const [error, setError] = useState('');
  const [cart, setCart] = useState<Item[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [purchaseAmount, setPurchaseAmount] = useState<number | null>(null);


  const handleSearch = async () => {
    setError('');
    setItem(null);
    try {
      const res = await fetch(`http://localhost:8000/items/${code}`);
      if (!res.ok) {
        throw new Error('Fetch error');
      }
      const data = await res.json();
      if (data === null) {
        setError('商品がマスタ未登録です');
      } else {
        setItem(data);
      }
    } catch (err) {
      setError('商品情報の取得に失敗しました');
    }
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">POS 商品検索</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="商品コードを入力"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="border p-2 mr-2"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          読み込み
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {item && (
        <div>
          <div className="border p-4 mt-4">
            <p><strong>商品コード：</strong> {item.CODE}</p>
            <p><strong>商品名：</strong> {item.NAME}</p>
            <p><strong>単価：</strong> ¥{item.PRICE}</p>
          </div>
          <button
            onClick={() => {
              if (item) {
                setCart([...cart, item]);
                setItem(null);
                setCode('');
              }
            }}
            className="bg-green-500 text-white px-4 py-1 rounded mt-2"
          >
            リストに追加
          </button>
        </div>
      )}

      {cart.length > 0 && (
        <div className="mt-8 border p-4">
          <h2 className="text-lg font-semibold mb-2">購入リスト</h2>
          <ul>
            {cart.map((c, idx) => (
              <li key={idx} className="mb-1">
                {c.NAME}（{c.PRICE}円）
              </li>
            ))}
          </ul>
          <button
            onClick={async () => {
              if (cart.length === 0) return;

              try {
                const res = await fetch('http://localhost:8000/purchase', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    EMP_CD: '1234567890',  // ダミーのレジ担当者コード
                    items: cart.map(item => ({
                      PRD_ID: item.PRD_ID,
                      PRD_CODE: item.CODE,
                      PRD_NAME: item.NAME,
                      PRD_PRICE: item.PRICE,
                    })),
                  }),
                });

                console.log('レスポンスstatus:', res.status);
                let result;
                try {
                  result = await res.json();
                  console.log('JSONレスポンス:', result);
                } catch (jsonErr) {
                  const text = await res.text();
                  console.log('テキストレスポンス:', text);
                  throw new Error(text);
                }

                if (!res.ok) {
                  throw new Error('購入失敗');
                }

                setPurchaseAmount(result.total_amount);
                setShowModal(true);

                setCart([]);
                setCode('');
                setItem(null);
                setError('');
              } catch (err) {
                console.log('購入処理エラー:', err);
                alert('購入処理に失敗しました');
              }
            }}
            className="mt-4 bg-purple-600 text-white px-4 py-2 rounded"
          >
            購入
          </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-xl font-bold mb-4">購入完了</h2>
            <p className="mb-4">合計金額: <span className="text-green-600 font-bold">¥{purchaseAmount}</span></p>
            <button
              onClick={() => setShowModal(false)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
