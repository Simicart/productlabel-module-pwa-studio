import React from 'react';
import defaultClasses from './Label.css'


const Label = props => {

	const classes = defaultClasses
	if(props.labelData){
		return (	
			<div >
				{props.labelData.productDetail.items[0].mp_label_data.map(result => {
					const font = result.label_font;
					const fontSize = result.label_font_size;
					const color = result.label_color
					const style = {
						fontFamily: font,
						fontSize: fontSize,
						color: color
					}
					if(result.label_image) {
						return <img className={classes.label} src={result.label_image} />
					} else {
						return (
							<div className={classes.template}> 
									<span
										style={style}
									 	className={classes.text}
									>{result.label}</span>
									<img style={JSON.parse(result.list_position)} src={result.label_template} />
							</div>
						)
					}
				})}
			</div>
		)
	} else return null
}

export default Label;