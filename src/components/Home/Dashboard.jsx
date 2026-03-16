import { useNavigate } from 'react-router-dom';
import BinStatusCard from './BinStatusCard';
import CollectionOverview from './CollectionOverview';
import WasteMap from './Wastemap';
import { useEffect } from 'react';

export default function Dashboard() {

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const cards = [
    { title: "Total Bins", value: 230, img: "wastebin.png" },
    { title: "Full Bins", value: 56, img: "fullbin.png" },
    { title: "Collections Today", value: 6, img: "truck.png" },
    { title: "Active Alerts", value: 4, img: "alert.png" }
  ]

  return (

    <div
      style={{
        marginTop: '5rem',
        marginLeft: '16rem',
        padding: '1rem',
        width: 'calc(100% - 16rem)',
        boxSizing: 'border-box'
      }}
    >

      {/* Cards */}
      <div
        style={{
          display: 'flex',
          gap: '1rem'
        }}
      >

        {cards.map((card, index) => (
          <div
            key={index}
            style={{
              border: '1px solid #ddd',
              borderRadius: '0.7rem',
              padding: '1rem',
              flex: 1,
              height: '7rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              minWidth: 0
            }}
          >

            <div style={{ textAlign: 'left' }}>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#555' }}>
                {card.title}
              </p>

              <p style={{ margin: 0, fontSize: '1.7rem', fontWeight: 'bold' }}>
                {card.value}
              </p>
            </div>

            <img
              src={require(`../../images/${card.img}`)}
              alt={card.title}
              style={{ width: '3rem' }}
            />

          </div>
        ))}

      </div>

      {/* Main Layout */}
      <div
        style={{
          marginTop: "2rem",
          border: "1px solid #ddd",
          borderRadius: "0.7rem",
          padding: "1rem",
          display: "flex",
          gap: "1rem"
        }}
      >

        {/* LEFT SIDE */}
        <div style={{ flex: 2, minWidth: 0 }}>

          <WasteMap />

          <div
            style={{
              border: "1px solid #ddd",
              marginTop: "1rem",
              borderRadius: "0.5rem",
              padding: "1rem",
            }}
          >
            <CollectionOverview />
          </div>

        </div>

        {/* RIGHT SIDE */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: "1rem",
            minWidth: 0
          }}
        >

          <BinStatusCard />

          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: "0.5rem",
              overflow: "hidden"
            }}
          >

            <img
              src={require(`../../images/whitescreenwastebin.png`)}
              alt="Collection Schedule"
              style={{
                width: "100%",
                height: "auto",
                opacity: 0.5
              }}
            />

          </div>

        </div>

      </div>

    </div>

  )
}