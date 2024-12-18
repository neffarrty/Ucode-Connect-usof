import React from 'react';

const Logo: React.FC = () => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={210}
			height={75}
			viewBox="62 0 95 68"
		>
			<svg
				fill="#852e4e"
				viewBox="0 0 20.00 20.00"
				width={60}
				height={60}
			>
				<path d="M13.93,5.92l-7.79,0h0A1.25,1.25,0,0,0,4.91,7.09l0,8.5a.38.38,0,0,0,.23.35.4.4,0,0,0,.15,0,.35.35,0,0,0,.26-.12c.7-.71,1.93-1.72,2.46-1.72H8l5.92,0h0A1.23,1.23,0,0,0,15.1,13l0-5.8A1.23,1.23,0,0,0,13.93,5.92Zm.42,7a.47.47,0,0,1-.14.33.59.59,0,0,1-.33.14L8,13.38c-.71,0-1.69.75-2.34,1.33l0-7.62a.47.47,0,0,1,.47-.47h0l7.78,0a.44.44,0,0,1,.33.14.48.48,0,0,1,.14.34Z" />
			</svg>
			<rect x={30} y={30} width={30} height={25} rx={3} fill="#4c1d3d" />
			<text
				x={35}
				y={47}
				fontFamily="monospace"
				fontSize={13}
				fontWeight="bold"
				fill="#fff"
			>
				{'>_'}
			</text>
			<text x={65} y={45} fontFamily="Arial" fontSize={33} fill="#852e4e">
				{'Code'}
			</text>
			<text
				x={140}
				y={45}
				fontFamily="Arial"
				fontSize={33}
				fill="#ffbb94"
				fontWeight="bold"
			>
				{'Talk'}
			</text>
		</svg>
	);
};

export default Logo;
