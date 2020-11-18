import React from 'react';
import defaultClasses from './Label.css'


const Label = props => {
	const classes = defaultClasses
	if(props.labelData){
		return (
			<div className={classes.container} style={{height: '100%', width: '100%'}}>
				{props.labelData.productDetail.items[0].mp_label_data.map(result => {
					const { width, height } = props;
					const labelHeight = `${JSON.parse(result.list_position).label.height*100/height}%`;
					const labelWidth = `${JSON.parse(result.list_position).label.width*100/width}%`;
					const hc = `${(width-JSON.parse(result.list_position).label.width)*100/(2*width)}%`;
					const vc = `${(height-JSON.parse(result.list_position).label.height)*100/(2*height)}%`
					let position;
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
						const fontSize = `${result.label_font_size}px`;
						const color = result.label_color
						const textStyle = {
							fontFamily: font,
							fontSize: fontSize,
							color: color
						}
						console.log(fontSize)
						const style = {...position, ...textStyle}
						console.log(style)
						if(width < 460) { //max-width of items' container is 459 => code below apply for items in category 
							return (
								<div 
									key={result.rule_id} 
									className={classes.template}
									style={style}
								> 
										<span
										 	className={classes.textItem}
										>{result.label}</span>
										<img src={result.label_template} style={{height: '100%', width: '100%'}}/>
								</div>
							)
						} else {
							return (
								<div 
									key={result.rule_id} 
									className={classes.template}
									style={style}
								> 
										<span
										 	className={classes.textCarousel}
										>{result.label}</span>
										<img src={result.label_template} style={{height: '100%', width: '100%'}}/>
								</div>
							)							
						}
					}
				})}
			</div>
		)
	} else return null
}

export default Label;