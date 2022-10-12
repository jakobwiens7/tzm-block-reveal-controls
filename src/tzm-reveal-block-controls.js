/**
 * External Dependencies
 */
import classnames from 'classnames';
const { assign, merge } = lodash;

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';

import {
	InspectorControls,	
	//__experimentalSpacingSizesControl as SpacingSizesControl,
	useSetting
} from '@wordpress/block-editor';

import {
	TabPanel,
	PanelRow,
	PanelBody,
	ToggleControl,
	Dashicon,
	__experimentalDivider as Divider,
	__experimentalBoxControl as BoxControl,
	__experimentalUseCustomUnits as useCustomUnits,
} from '@wordpress/components';


/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';
import './style.scss';


/**
 * Add custom attributes for reveal block settings.
 *
 * @param {Object} settings Settings for the block.
 *
 * @return {Object} settings Modified settings.
 */
function addRevealAttributes( settings ) {
	
	// check if object exists for old Gutenberg version compatibility
	if ( typeof settings.attributes !== 'undefined' ) {
		
		return assign( {}, settings, {
			attributes: merge(settings.attributes, {
				revealControls: {
					type: 'object',
					default: null
				}
			})
		});
	}
	return settings;
}


/**
 * Add reveal block controls on Block Panel.
 *
 * @param {function} BlockEdit Block edit component.
 *
 * @return {function} BlockEdit Modified block edit component.
 */
const withRevealControls = createHigherOrderComponent( (BlockEdit) => {
	return (props) => {

		const {
			name,
			attributes,
			setAttributes
		} = props;
		
		const {
			revealControls
		} = attributes;

		
		const isContainerBlock = (
			name === 'core/group' ||
			name === 'core/columns' ||
			name === 'core/cover' ||
			name === 'core/media-text' ||
			name === 'tzm/section'
		);

		const units = useCustomUnits( {
			availableUnits: useSetting( 'spacing.units' ) || [
				'%',
				'px',
				'em',
				'rem',
				'vw',
			],
		} );


		function isRevealControlsEmpty(newRevealControls = revealControls) {
			if (newRevealControls && typeof newRevealControls === 'object') {

				// Check every option in attribute
				for (let option in newRevealControls) {
					if (newRevealControls[option]) {
						return false;
					};
				}
			}	
			return true;
		}

		function setOption(option, newVal) {
			let newRevealControls = revealControls || {};

			// Check if newRevealControls is empty and reset attribute
			if ( isRevealControlsEmpty(newRevealControls) ) {
				setAttributes({	revealControls: null });

			// Then set the attribute
			} else {
				setAttributes({	revealControls: { ...newRevealControls } });
			}
		}


		
		return (
			<>
				<BlockEdit {...props} />
				<InspectorControls>
					<PanelBody
						className={ classnames('block-editor-panel-reveal', {}) }
						title={ __('Reveal on scroll', "tzm-reveal-block-controls") }
						initialOpen={ false }
					>
						<PanelRow>
							<ToggleControl
								label={ __('Hide', "tzm-reveal-block-controls") }
								checked={ !!revealControls?.hidden }
								onChange={ (newVal) => setOption('hidden', newVal) }
							/>
							<Dashicon icon="visibility"/>
						</PanelRow>

						<Divider />
						
						<BoxControl
							label={ __( 'Padding' ) }
							values={ paddingValues }
							units={ units }
							onChange={ (newVal) => setOption('padding', newVal) }
						/>
					</PanelBody>
				</InspectorControls>
			</>
		);
	};
}, 'withRevealControls');


/**
 * Add reveal classes to the block in the editor
 */
const addRevealClassesEditor = createHigherOrderComponent( (BlockListBlock) => {
	return (props) => {
		
		const {
			attributes,
			className
		} = props;
		
		const {
			revealControls
		} = attributes;

		function getClasses() {
			let classes = [];

			if (revealControls && typeof revealControls === 'object') {
				for (const [option, value] of Object.entries(revealControls)) {

					if (option !== 'padding' && option !== 'margin' && value) {
						classes.push('tzm-reveal-' + option.toLowerCase());
					}
				}
			}
			return classes;
		}

		function getStyles() {
			let styles = {};

			if (revealControls && typeof revealControls === 'object') {
				for (const [option, value] of Object.entries(revealControls)) {

					if ( (option == 'padding' || option == 'margin') && typeof value === 'object') {
						if (Object.keys(value).length === 4) {
							let isShort = (value['top'] == value['right'] && value['top'] == value['bottom'] && value['top'] == value['left']);
							let valStr = value['top'] + ' ' + value['right'] + ' ' + value['bottom'] + ' ' + value['left'];
							styles['--tzm--reveal--' + option] = isShort ? value['top'] : valStr;
						
						} else {
							for (const [dir, dirVal] of Object.entries(value)) {
								styles['--tzm--reveal--' + option + '-' + dir] = dirVal;
							}
						}
					}
				}
			}
			return styles;
		}

		let wrapperProps = props.wrapperProps || {};
        wrapperProps.style = getStyles();

		return (
			<BlockListBlock	{ ...props } 
				className={ classnames(className, getClasses()) }
				wrapperProps={ wrapperProps }
			/>
		);
	};
}, 'addRevealClassesEditor' );


/**
 * Add custom element class in save element.
 *
 * @param {Object} props     	Block element.
 * @param {Object} block      	Blocks object.
 * @param {Object} attributes	Blocks attributes.
 *
 * @return {Object} extraProps Modified block element.
 */
/*function addResponsiveClasses( props, block, attributes ) {

	const { 
		className,
 	} = props;
	
	const {
		revealControls
	} = attributes;
	
	return assign( {}, props, {
		className: classnames( 
			className, 'tzm-reveal-test', {
				[`tzm-reveal-${revealControls?.id}`]: revealControls && revealControls.id
			}
		)
	} );
}*/

addFilter(
	'blocks.registerBlockType',
	'tzm/reveal-attributes',
	addRevealAttributes
);

addFilter(
	'editor.BlockEdit',
	'tzm/reveal-controls',
	withRevealControls
);

addFilter(
   'editor.BlockListBlock',
   'tzm/reveal-classes-editor',
   addRevealClassesEditor
);

/*addFilter(
	'blocks.getSaveContent.extraProps',
	'tzm/reveal-classes-frontend',
	addRevealClasses
);*/