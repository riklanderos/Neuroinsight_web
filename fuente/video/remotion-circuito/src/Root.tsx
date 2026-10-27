import React from 'react';
import {Composition} from 'remotion';
import {Circuito, LOOP} from './Circuito';

export const RemotionRoot: React.FC = () => (
	<>
		<Composition id="Circuito" component={Circuito} durationInFrames={LOOP} fps={30} width={1280} height={720} defaultProps={{transpose: false}} />
		<Composition id="CircuitoVertical" component={Circuito} durationInFrames={LOOP} fps={30} width={720} height={1280} defaultProps={{transpose: true}} />
	</>
);
