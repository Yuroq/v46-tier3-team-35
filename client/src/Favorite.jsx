import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Favorite({ email }) {
  const [likedCoins, setLikedCoins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLikedCoins() {
      try {
        const response = await axios.get(
          `http://localhost:8000/favorite/list/${email}`
        );
        setLikedCoins(response.data);
      } catch (err) {
        console.error("Error fetching liked coins:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLikedCoins();
  }, [email]);

  const handleDislike = async (coinName) => {
    try {
      await axios.delete("http://localhost:8000/favorite/dislike", {
        data: {
          name: coinName,
          userEmail: email,
        },
      });
      // You might want to update the state to remove the coin from the list
      setLikedCoins((prevCoins) =>
        prevCoins.filter((coin) => coin.name !== coinName)
      );
    } catch (error) {
      console.error("Error disliking the coin:", error);
    }
  };
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (likedCoins.length === 0) {
    return <div className="text-black">You have not liked any coins yet</div>;
  }

  return (
    <div className="overflow-x-auto p-2">
      <div className="max-w-3xl mx-auto overflow-hidden rounded-lg shadow">
        <table className="table w-full" data-theme="light">
          <thead>
            <tr>
              <th className="text-sm font-semibold text-[#4A4A4A]">#</th>
              <th className="text-sm font-semibold text-[#4A4A4A]">Symbol</th>
              <th className="text-sm font-semibold text-[#4A4A4A]">Name</th>
              <th className="text-sm font-semibold text-[#4A4A4A]">Action</th>
            </tr>
          </thead>
          <tbody>
            {likedCoins.map((coin, index) => (
              <tr key={index}>
                <th className="text-sm font-medium text-gray-900">
                  {index + 1}
                </th>
                <td>
                  <Link to={`/coin/${coin.name}`}>
                    <img className="h-8" src={coin.image} alt={coin.symbol} />
                  </Link>
                </td>
                <td>
                  <Link
                    to={`/coin/${coin.name}`}
                    className="font-semibold text-[#333333]"
                  >
                    {coin.name.charAt(0).toUpperCase() + coin.name.slice(1)}
                  </Link>
                </td>
                <td>
                  <button
                    className="rounded bg-blue-600 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    onClick={() => handleDislike(coin.name)}
                  >
                    Unlike
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Favorite;
