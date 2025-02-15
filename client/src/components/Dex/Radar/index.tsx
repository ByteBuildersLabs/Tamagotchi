import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import './main.css';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface BeastDex {
  Attack: string;
  Defense: string;
  Speed: string;
}

interface RadarStatsProps {
  beast: BeastDex;
}

function RadarStats({ beast }: RadarStatsProps): JSX.Element {
  const data = {
    labels: [
      'Attack', 
      'Defense',
      'Speed'
    ],
    datasets: [{
      label: '',
      data: [
        Math.round(Number(beast.Attack)),
        Math.round(Number(beast.Defense)),
        Math.round(Number(beast.Speed)),
      ],
      fill: true,
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',   
        'rgba(54, 162, 235, 0.2)',  
        'rgba(75, 192, 192, 0.2)',   
      ],
      borderColor: [
        'rgb(255, 99, 132)',       
      ],
      borderWidth: 2,
      pointBackgroundColor: [
        'rgb(255, 99, 132)',
      ],
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: [
        'rgb(255, 99, 132)',
      ]
    }]
};

const options: ChartOptions<'radar'> = {
    scales: {
      r: {
        angleLines: {
          display: true,
          color: 'rgba(255, 255, 255, 0.2)',  
        },
        suggestedMin: 0,
        suggestedMax: 20,
        ticks: {
          stepSize: 5,
          display: false
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.2)',  
          circular: false                     
        },
        pointLabels: {
          font: {
            size: 16,
            weight: 'bolder',
            family: "'Montserrat', sans-serif"
          },
          color: '#FFFFFF',                   
          padding: 20                        
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    },
    elements: {
      line: {
        borderWidth: 3,                       
        tension: 0
      },
      point: {
        radius: 5,                          
        hoverRadius: 7,
        borderWidth: 2
      }
    },
    maintainAspectRatio: true
};
  

  return (
    <div className="flex justify-center items-center w-full">
      <div className="radar-stats-container">
        <Radar data={data} options={options} />
      </div>
    </div>
  );
}

export default RadarStats;