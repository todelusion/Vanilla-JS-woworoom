const data = {
    labels: [
      '1',
      '2',
      '3',
      '4'
    ],
    datasets: [{
      label: 'My First Dataset',
      data: [300, 50, 100, 150],
      backgroundColor: [
        'rgb(171, 221, 255)',
      ],
      hoverBackgroundColor: [
        'rgb(1, 51, 85)'
      ],
      hoverOffset: 10
    }]
  };

  const config = {
    type: 'doughnut',
    data: data,
  };


ctx = document.getElementById('myChart');
const myChart = new Chart(ctx, config)