import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';

// NeuroInsight brand palette
const NAVY = '#021E4B';
const BLUE = '#1D78C9';
const SKY = '#8EC0F0';
const LIGHT = '#DCE9F7';

export const LOOP = 240; // 8 s @ 30 fps — everything below is periodic in frame / LOOP
const TAU = Math.PI * 2;

type Pt = [number, number];
type Trace = {
	pts: Pt[]; // polyline, only 0° / 45° / 90° turns
	end: 'dot' | 'ring';
	pulses: number; // cycles per loop (integer, keeps the loop seamless); 0 = static stub
	phase: number; // 0..1 offset inside the cycle
	mid?: number[]; // indexes of elbow points that carry a small node
};

// Designed in a 1280x720 space. The centre-left (approx x 80–720, y 150–470) is kept clear for copy.
const TRACES: Trace[] = [
	// bottom band
	{pts: [[-30, 640], [180, 640], [240, 580], [420, 580]], end: 'dot', pulses: 1, phase: 0.05, mid: [2]},
	{pts: [[300, 750], [300, 690], [350, 640], [560, 640]], end: 'ring', pulses: 2, phase: 0.62},
	{pts: [[620, 750], [620, 690], [700, 610], [860, 610]], end: 'dot', pulses: 1, phase: 0.38, mid: [2]},
	{pts: [[980, 750], [980, 680], [920, 620], [920, 540]], end: 'ring', pulses: 2, phase: 0.2},
	{pts: [[1310, 660], [1120, 660], [1060, 600], [1060, 520], [1000, 460]], end: 'dot', pulses: 1, phase: 0.72, mid: [2]},
	// right edge
	{pts: [[1310, 420], [1180, 420], [1120, 360], [1040, 360]], end: 'ring', pulses: 1, phase: 0.9},
	{pts: [[1310, 250], [1220, 250], [1150, 180], [1150, 120]], end: 'dot', pulses: 2, phase: 0.45, mid: [1]},
	{pts: [[1060, -30], [1060, 60], [1000, 120], [1000, 220], [940, 280]], end: 'dot', pulses: 1, phase: 0.55, mid: [2]},
	{pts: [[880, -30], [880, 40], [820, 100], [740, 100]], end: 'ring', pulses: 1, phase: 0.15},
	// left edge (sparse)
	{pts: [[-30, 90], [70, 90], [110, 50], [220, 50]], end: 'ring', pulses: 1, phase: 0.3},
	{pts: [[-30, 470], [30, 470], [70, 510], [70, 545]], end: 'dot', pulses: 2, phase: 0.85},
	// static stubs (branch twigs, like the logo's side nodes)
	{pts: [[240, 580], [240, 535]], end: 'ring', pulses: 0, phase: 0},
	{pts: [[1180, 420], [1225, 375]], end: 'ring', pulses: 0, phase: 0},
	{pts: [[820, 100], [820, 150]], end: 'dot', pulses: 0, phase: 0},
	{pts: [[700, 610], [740, 650], [790, 650]], end: 'ring', pulses: 0, phase: 0},
	{pts: [[1060, 600], [1010, 600]], end: 'ring', pulses: 0, phase: 0},
];

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (a: number, b: number, x: number) => {
	const t = clamp01((x - a) / (b - a));
	return t * t * (3 - 2 * t);
};
// power3 in-out and its derivative
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeV = (t: number) => (t < 0.5 ? 12 * t * t : 3 * Math.pow(-2 * t + 2, 2));
const frac = (x: number) => x - Math.floor(x);

const polyLen = (pts: Pt[]) => {
	let L = 0;
	for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
	return L;
};
const pointAt = (pts: Pt[], d: number): Pt => {
	let acc = 0;
	for (let i = 1; i < pts.length; i++) {
		const seg = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
		if (acc + seg >= d) {
			const k = (d - acc) / seg;
			return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * k, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * k];
		}
		acc += seg;
	}
	return pts[pts.length - 1];
};

const ACTIVE = 0.55; // share of each cycle the pulse is travelling

export const Circuito: React.FC<{transpose?: boolean}> = ({transpose = false}) => {
	const frame = useCurrentFrame();
	const {width, height} = useVideoConfig();
	const u = frame / LOOP; // 0..1, periodic
	const tp = (p: Pt): Pt => (transpose ? [p[1], p[0]] : p);

	const glowX = (transpose ? 0.5 : 0.4) * width + 40 * Math.sin(TAU * u);
	const glowY = (transpose ? 0.42 : 0.48) * height + 26 * Math.cos(TAU * u);
	const glowA = 0.2 + 0.035 * Math.sin(TAU * u + 1.1);

	return (
		<AbsoluteFill style={{backgroundColor: NAVY}}>
			<svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
				<defs>
					<radialGradient id="glow" cx={glowX} cy={glowY} r={Math.max(width, height) * 0.62} gradientUnits="userSpaceOnUse">
						<stop offset="0" stopColor={BLUE} stopOpacity={glowA} />
						<stop offset="0.45" stopColor={BLUE} stopOpacity={glowA * 0.4} />
						<stop offset="1" stopColor={BLUE} stopOpacity={0} />
					</radialGradient>
					<radialGradient id="glow2" cx={transpose ? width * 0.85 : width * 0.88} cy={transpose ? height * 0.9 : height * 0.95} r={Math.max(width, height) * 0.4} gradientUnits="userSpaceOnUse">
						<stop offset="0" stopColor={BLUE} stopOpacity={0.09 + 0.02 * Math.sin(TAU * u + 2.4)} />
						<stop offset="1" stopColor={BLUE} stopOpacity={0} />
					</radialGradient>
					<filter id="soft" x="-50%" y="-50%" width="200%" height="200%">
						<feGaussianBlur stdDeviation="5" />
					</filter>
					<filter id="halo" x="-200%" y="-200%" width="500%" height="500%">
						<feGaussianBlur stdDeviation="7" />
					</filter>
				</defs>
				<rect width={width} height={height} fill="url(#glow)" />
				<rect width={width} height={height} fill="url(#glow2)" />

				{TRACES.map((tr, i) => {
					const pts = tr.pts.map(tp);
					const d = 'M ' + pts.map((p) => `${p[0]} ${p[1]}`).join(' L ');
					const L = polyLen(pts);
					const endPt = pts[pts.length - 1];
					const breathe = 0.31 + 0.06 * Math.sin(TAU * u + i * 1.7);

					// pulse state (periodic)
					let head = -1;
					let tail = 0;
					let pulseA = 0;
					let arrive = 0; // node glow 0..1
					let pop = 0;
					if (tr.pulses > 0) {
						const t = frac(u * tr.pulses + tr.phase);
						if (t < ACTIVE) {
							const s = t / ACTIVE;
							head = ease(s) * L;
							tail = 16 + 80 * (easeV(s) / 1.5);
							pulseA = smooth(0, 0.08, s);
						}
						const after = t - ACTIVE;
						arrive = t < ACTIVE ? smooth(ACTIVE - 0.035, ACTIVE, t) : Math.exp(-after / 0.11) * (1 - smooth(0.85, 1, t));
						pop = after > 0 ? Math.sin(Math.PI * clamp01(after / 0.09)) : 0;
					}
					const nodeR = (tr.pulses > 0 ? 5 : 4) * (1 + 0.28 * pop);
					const headPt = head >= 0 ? pointAt(pts, Math.min(head, L)) : null;

					return (
						<g key={i}>
							<path d={d} fill="none" stroke={SKY} strokeOpacity={breathe} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
							{tr.mid?.map((mi) => {
								const p = pts[mi];
								return <circle key={mi} cx={p[0]} cy={p[1]} r={3.2} fill={SKY} fillOpacity={breathe + 0.05} />;
							})}

							{head >= 0 && (
								<g opacity={pulseA}>
									<path
										d={d}
										fill="none"
										stroke={SKY}
										strokeOpacity={0.55}
										strokeWidth={6}
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeDasharray={`${tail} ${L + tail + 50}`}
										strokeDashoffset={tail - head}
										filter="url(#soft)"
									/>
									<path
										d={d}
										fill="none"
										stroke={LIGHT}
										strokeOpacity={0.9}
										strokeWidth={1.8}
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeDasharray={`${tail} ${L + tail + 50}`}
										strokeDashoffset={tail - head}
									/>
									{headPt && <circle cx={headPt[0]} cy={headPt[1]} r={2.4} fill="#FFFFFF" />}
								</g>
							)}

							{/* end node */}
							{arrive > 0.002 && (
								<circle cx={endPt[0]} cy={endPt[1]} r={16} fill={SKY} fillOpacity={0.55 * arrive} filter="url(#halo)" />
							)}
							{tr.end === 'dot' ? (
								<circle cx={endPt[0]} cy={endPt[1]} r={nodeR} fill={arrive > 0.002 ? LIGHT : SKY} fillOpacity={0.42 + 0.55 * arrive} />
							) : (
								<>
									<circle cx={endPt[0]} cy={endPt[1]} r={nodeR} fill={LIGHT} fillOpacity={0.85 * arrive} stroke={SKY} strokeOpacity={0.45 + 0.5 * arrive} strokeWidth={1.6} />
								</>
							)}
						</g>
					);
				})}
			</svg>
		</AbsoluteFill>
	);
};
