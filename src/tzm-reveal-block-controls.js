/**
 * External Dependencies
 */
import clsx from 'clsx';
const { assign, merge } = lodash;

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';

import {
	InspectorControls,	
} from '@wordpress/block-editor';

import {
	PanelRow,
	PanelBody,
	//Dashicon,
	//Button,
	ToggleControl,
	SelectControl,
	RangeControl,
} from '@wordpress/components';


/**
 * Internal Dependencies
 */
import { 
	//hasNestedValue,
	cleanEmptyObject
} from './_utils';


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
			attributes,
			setAttributes,
		} = props;
		
		const {
			revealControls
		} = attributes;

		const defaultRevealControls = {
			enabled: false,
			effect: 'fade',
			permanent: false,
			delay: 0,
			duration: 400,
			easing: 'default'
		};


		// Clean and update 'revealControls' attribute
		function updateAttribute( updatedRevealControls = {} ) {
			const cleanRevealControls = cleanEmptyObject(updatedRevealControls);
			setAttributes({ revealControls: cleanRevealControls });
		}
	
		return (
			<>
				<BlockEdit {...props} />
				<InspectorControls>
					<PanelBody
						className={ clsx('block-editor-panel-reveal', {}) }
						title={ __('Reveal on scroll', "tzm-reveal-block-controls") }
						initialOpen={ false }
						// WIP: Add animation preview button (inside panel label?)
					>
						<PanelRow>
							<ToggleControl __nextHasNoMarginBottom
								label={ revealControls?.enabled ? __('Enabled', "tzm-reveal-block-controls") : __('Disabled', "tzm-reveal-block-controls") }
								checked={ revealControls?.enabled }
								onChange={ (newValue) => updateAttribute({ ...revealControls, enabled: newValue }) }
							/>
						</PanelRow>
						{ !! revealControls?.enabled && (
						<>
							<PanelRow>
								<SelectControl __nextHasNoMarginBottom __next40pxDefaultSize
									label={ __('Reveal Effect', "tzm-reveal-block-controls") }
									value={ revealControls?.effect || defaultRevealControls.effect }
									options={ [
										{ label: __('Fade', "tzm-reveal-block-controls"), value: 'fade' },
										{ label: __('Slide up', "tzm-reveal-block-controls"), value: 'slide-up' },
										{ label: __('Slide down', "tzm-reveal-block-controls"), value: 'slide-down' },
										{ label: __('Slide left', "tzm-reveal-block-controls"), value: 'slide-left' },
										{ label: __('Slide right', "tzm-reveal-block-controls"), value: 'slide-right' },
										{ label: __('Rotate', "tzm-reveal-block-controls"), value: 'rotate' },
										{ label: __('Zoom in', "tzm-reveal-block-controls"), value: 'zoom-in' },
										{ label: __('Zoom out', "tzm-reveal-block-controls"), value: 'zoom-out' }
									] }
									onChange={ (newValue) => updateAttribute({ ...revealControls, effect: newValue }) }
								/>
							</PanelRow>
							<PanelRow>
								<ToggleControl __nextHasNoMarginBottom
									label={ __('Reveal permanently', "tzm-reveal-block-controls") }
									help={ __("Enable this option to keep the block permanently visible when it has been revealed once.", "tzm-reveal-block-controls") }
									checked={ !! revealControls?.permanent || defaultRevealControls.permanent }
									onChange={ (newValue) => updateAttribute({ ...revealControls, permanent: newValue }) }
								/>
							</PanelRow>
							<PanelRow>
								<SelectControl __nextHasNoMarginBottom __next40pxDefaultSize
									label={ __('Animation easing', "tzm-reveal-block-controls") }
									value={ revealControls?.easing || defaultRevealControls.easing }
									options={ [
										{ label: __('Default', "tzm-reveal-block-controls"), value: 'default' },
										{ label: __('Linear', "tzm-reveal-block-controls"), value: 'linear' },
										{ label: __('Sine', "tzm-reveal-block-controls"), value: 'sine' },
										{ label: __('Cubic', "tzm-reveal-block-controls"), value: 'cubic' },
										{ label: __('Quint', "tzm-reveal-block-controls"), value: 'quint' },
										{ label: __('Back', "tzm-reveal-block-controls"), value: 'back' }
									] }
									onChange={ (newValue) => updateAttribute({ ...revealControls, easing: newValue }) }
								/>
							</PanelRow>
							<PanelRow>
								<RangeControl __nextHasNoMarginBottom __next40pxDefaultSize
									label={ __('Reveal duration (in ms)', "tzm-reveal-block-controls") }
									value={ revealControls?.duration || defaultRevealControls.duration }
									onChange={ (newValue) => updateAttribute({ ...revealControls, duration: newValue }) }
									step={ 100 }
									min={ 100 }
									max={ 2000 }
									marks={[
										{value: 100},
										{value: 400},
										{value: 800},
										{value: 1200},
										{value: 1600},
										{value: 2000}
									]}
								/>
							</PanelRow>
							<PanelRow>
								<RangeControl __nextHasNoMarginBottom __next40pxDefaultSize
									label={ __('Reveal delay (in ms)', "tzm-reveal-block-controls") }
									value={ revealControls?.delay || defaultRevealControls.delay }
									onChange={ (newValue) => updateAttribute({ ...revealControls, delay: newValue }) }
									step={ 150 }
									min={ 0 }
									max={ 3000 }
									marks={[ 
										{value: 0},
										{value: 300},
										{value: 600},
										{value: 900},
										{value: 1200},
										{value: 1500},
										{value: 1800},
										{value: 2100},
										{value: 2400},
										{value: 2700},
										{value: 3000}
									]}
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
const addRevealStylingEditor = createHigherOrderComponent( (BlockListBlock) => {
	return (props) => {
		
		const {
			attributes,
			className,
		} = props;
		
		const {
			revealControls
		} = attributes;
		
		if (typeof revealControls !== 'object' || !revealControls?.['enabled']) {
			return (
				<BlockListBlock	{ ...props } />
			);
		}

		let revealClasses = [];
		let revealStyles = {};

		for (const [option, value] of Object.entries(revealControls)) {
			switch (option) {
				case 'effect':
					revealClasses.push('tzm-reveal__' + value);
					break;
				case 'permanent':
					revealClasses.push('tzm-reveal__' + option);
					break;
				case 'easing':
					revealClasses.push('tzm-reveal__ease-' + value);
					break;
				case 'duration':
					revealStyles['--tzm-reveal--duration'] = value + 'ms';
					break;
				case 'delay':
					revealStyles['--tzm-reveal--delay'] = value + 'ms';
					break;
			}

		}
		// If no options are set add default class 'tzm-reveal'
		if (!revealClasses.length) revealClasses.push('tzm-reveal');

		return (
			<BlockListBlock	{ ...props } 
				className={ clsx(className, revealClasses) }
				wrapperProps={ { ...props.wrapperProps, style: revealStyles } }
			/>
		);
	};
}, 'addRevealStylingEditor' );


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
   'tzm/reveal-styling-editor',
   addRevealStylingEditor
);