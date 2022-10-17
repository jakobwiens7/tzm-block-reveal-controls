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
	ColorPalette,
	//__experimentalSpacingSizesControl as SpacingSizesControl,
	//useSetting
} from '@wordpress/block-editor';

import {
	PanelRow,
	PanelBody,
	Dashicon,
	Button,
	ToggleControl,
	SelectControl,
	RangeControl,
	__experimentalRadio as Radio,
	__experimentalRadioGroup as RadioGroup,
	__experimentalUnitControl as UnitControl,
	__experimentalUseCustomUnits as useCustomUnits,
	__experimentalDivider as Divider
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
				revealBlock: {
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
			//name,
			attributes,
			setAttributes
		} = props;
		
		const {
			revealBlock
		} = attributes;

		/*
		const units = useCustomUnits( {
			availableUnits: useSetting( 'spacing.units' ) || [
				'%',
				'px',
				'em',
				'rem',
				'vw',
			],
		} );
		*/

		const defaultRevealBlock = {
			enabled: false,
			effect: 'fade',	// [fade, slide-up, slide-down, slide-left, slide-right, zoom-in, zoom-out, rotate, overlay?, custom?]
			distance: '100%',
			//color: undefined,	// WIP
			revealOnce: false,
			delay: 0, 			// WIP: Add or change to offset option
			duration: 500,
			easing: 'linear'	// [linear, sine, cubic, quint, back, bounce]
		};

		function isRevealBlockEmpty(newRevealBlock = revealBlock) {
			if (newRevealBlock && typeof newRevealBlock === 'object') {

				// Check every option in attribute
				for (let option in newRevealBlock) {
					if (newRevealBlock[option] && newRevealBlock[option] !== defaultRevealBlock[option]) {
						return false;
					};
				}
			}	
			return true;
		}

		function setOption(option, newVal) {
			let newRevealBlock = revealBlock || {};

			newRevealBlock = { ...newRevealBlock, [option]: (newVal && newVal !== defaultRevealBlock[option] ? newVal : undefined) };

			// Check if newRevealBlock is empty and reset attribute
			if ( isRevealBlockEmpty(newRevealBlock) ) {
				setAttributes({	revealBlock: null });
			}
			// Then set the attribute
			else {
				setAttributes({	revealBlock: newRevealBlock });
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
						// WIP: Add animation preview button (into panel label?)
					>
						<PanelRow>
							<ToggleControl
								label={ revealBlock?.enabled ? __('Enabled') : __('Disabled') }
								checked={ revealBlock?.enabled }
								onChange={ (newVal) => setOption('enabled', newVal) }
							/>
						</PanelRow>
						{ !!revealBlock?.enabled && (
						<>
							<PanelRow>
								<SelectControl
									label={ __('Reveal Effect', "tzm-reveal-block-controls") }
									value={ revealBlock?.effect || 'fade' }
									options={ [
										{ label: __('Fade', "tzm-reveal-block-controls"), value: 'fade' },
										{ label: __('Slide up', "tzm-reveal-block-controls"), value: 'slide-up' },
										{ label: __('Slide down', "tzm-reveal-block-controls"), value: 'slide-down' },
										{ label: __('Slide left', "tzm-reveal-block-controls"), value: 'slide-left' },
										{ label: __('Slide right', "tzm-reveal-block-controls"), value: 'slide-right' },
										{ label: __('Rotate', "tzm-reveal-block-controls"), value: 'rotate' },
										{ label: __('Zoom in', "tzm-reveal-block-controls"), value: 'zoom-in' },
										{ label: __('Zoom out', "tzm-reveal-block-controls"), value: 'zoom-out' },
									] }
									onChange={ (newVal) => setOption('effect', newVal) }
									__nextHasNoMarginBottom
								/>
							</PanelRow>
							<PanelRow>
								<ToggleControl
									label={ __('Reveal once only', "tzm-reveal-block-controls") }
									help={ __('Enable this option to keep the block permanently visible after leaving the viewport.', "tzm-reveal-block-controls") }
									checked={ !!revealBlock?.revealOnce }
									onChange={ (newVal) => setOption('revealOnce', newVal) }
								/>
							</PanelRow>
							<PanelRow>
								<RangeControl
									label={ __('Reveal delay', "tzm-reveal-block-controls") }
									value={ revealBlock?.delay || 0 }
									onChange={ (newVal) => setOption('delay', newVal) }
									step={ 1 }
									min={ 0 }
									max={ 5 }
									marks
								/>
							</PanelRow>
							<PanelRow>
								<SelectControl
									label={ __('Animation easing', "tzm-reveal-block-controls") }
									value={ revealBlock?.easing || 'linear' }
									options={ [
										{ label: __('Linear', "tzm-reveal-block-controls"), value: 'linear' },
										{ label: __('Sine', "tzm-reveal-block-controls"), value: 'sine' },
										{ label: __('Cubic', "tzm-reveal-block-controls"), value: 'cubic' },
										{ label: __('Quint', "tzm-reveal-block-controls"), value: 'quint' },
										{ label: __('Back', "tzm-reveal-block-controls"), value: 'back' },
										{ label: __('Bounce', "tzm-reveal-block-controls"), value: 'bounce' }
									] }
									onChange={ (newVal) => setOption('easing', newVal) }
									__nextHasNoMarginBottom
								/>
							</PanelRow>
						</>
						) }

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
			revealBlock
		} = attributes;

		function getClasses() {
			let classes = [];

			if (revealBlock && typeof revealBlock === 'object') {
				for (const [option, value] of Object.entries(revealBlock)) {
					if (option !== 'enabled') {
						if (option === 'revealOnce' && value) {
							classes.push('tzm-reveal-once');
						} else if (option === 'delay' && value) {
							classes.push('tzm-reveal-delay-' + value);
						} else if (option && value) {
							classes.push('tzm-reveal-' + value);
						}
					}
				}
				// If no options are set add default class 'tzm-reveal'
				if (revealBlock?.['enabled'] && !classes.length) classes.push('tzm-reveal');
			}
			classes.push('visible');
			return classes;
		}

		function getStyles() {
			let styles = {};

			if (revealBlock && typeof revealBlock === 'object') {
				for (const [option, value] of Object.entries(revealBlock)) {
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
		revealBlock
	} = attributes;
	
	return assign( {}, props, {
		className: classnames( 
			className, 'tzm-reveal-test', {
				[`tzm-reveal-${revealBlock?.id}`]: revealBlock && revealBlock.id
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