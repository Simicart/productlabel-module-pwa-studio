import React from 'react';
import defaultClasses from './Label.css'


const Label = props => {

	const classes = defaultClasses
	if(props.labelData){
		console.log(props.labelData)
		return (
			<div className={classes.container}>
				{props.labelData.productDetail.items[0].mp_label_data.map(result => {
					const { width, ratio } = props;
					const height = width / ratio
					const labelHeight = JSON.parse(result.list_position).label.height;
					const labelWidth = JSON.parse(result.list_position).label.width;
					const hc = (width - labelWidth)/2
					const vc = (height - labelHeight)/2
					let position;
					let css;
					switch(result.list_position_grid) {
						case 'tl':
							position = {
								width: labelWidth,
								height: labelHeight,
								top: 0,
								left: 0
							};
							break;
						case 'tc':
							position = {
								width: labelWidth,
								height: labelHeight,
								top: 0,
								left: hc
							};
							break;
						case 'tr':
							position = {
								width: labelWidth,
								height: labelHeight,
								top: 0,
								right: 0
							};
							break;
						case 'cl':
							position = {
								width: labelWidth,
								height: labelHeight,
								top: vc,
								left: 0
							};
							break;
						case 'cc':
							position = {
								width: labelWidth,
								height: labelHeight,
								top: vc,
								left: hc
							};
							break;
						case 'cr':
							position = {
								width: labelWidth,
								height: labelHeight,
								top: vc,
								right: 0
							};
							break;
						case 'bl':
							position = {
								width: labelWidth,
								height: labelHeight,
								bottom: 0,
								left: 0
							};
							break;
						case 'bc':
							position = {
								width: labelWidth,
								height: labelHeight,
								bottom: 0,
								left: hc
							};
							break;
						case 'br':
							position = {
								width: labelWidth,
								height: labelHeight,
								bottom: 0,
								right: 0
							};
							break;
					}
					if(result.label_image) {
						return (
							<img 
								key={result.rule_id} 
								className={classes.label} 
								src={result.label_image}
								style={position}
							/>
						)
					} else {
						const font = result.label_font;
						const fontSize = result.label_font_size;
						const color = result.label_color
						const textStyle = {
							fontFamily: font,
							fontSize: fontSize,
							color: color
						}
						return (
							<div 
								key={result.rule_id} 
								className={classes.template}
								style={position}
							> 
									<span
										style={textStyle}
									 	className={classes.text}
									>{result.label}</span>
									<img src={result.label_template} />
							</div>
						)
					}
				})}
			</div>
		)
	} else return null
}

export default Label;