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
//import { registerPlugin } from '@wordpress/plugins';
//import { PluginMoreMenuItem } from '@wordpress/editor';
//import { check } from '@wordpress/icons';
//import { useEffect, useRef, useState } from "@wordpress/element";

import { 
	useSelect,
	useDispatch, 
	createReduxStore, 
	register 
} from "@wordpress/data";

import {
	InspectorControls,
} from '@wordpress/block-editor';

import {
	PanelRow,
	PanelBody,
	Button,
	ToggleControl,
	SelectControl,
	RangeControl,
} from '@wordpress/components';

/**
 * Internal Dependencies
 */
//import BlockListBlockWithIO from './block-list-block-with-io';


// Register a custom store to manage block preview states
const PREVIEW_STORE = 'tzm/block-reveal-preview';

const store = createReduxStore(PREVIEW_STORE, {
    reducer(state = {}, action) {
        switch (action.type) {
            case "PREVIEW_BLOCK":
                return { ...state, [action.clientId]: true };
            case "REMOVE_PREVIEW":
                const newState = { ...state };
                delete newState[action.clientId];
                return newState;
            default:
                return state;
        }
    },
    actions: {
        previewBlock(clientId) { return { type: "PREVIEW_BLOCK", clientId } },
        removePreview(clientId) { return { type: "REMOVE_PREVIEW", clientId } }
    },
    selectors: {
        isBlockPreviewed(state, clientId) { return !!state[clientId] }
    },
});
register(store);


/**
 * Internal Dependencies
 */
import { 
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
function addBlockRevealAttribute( settings ) {
	
	// check if object exists for old Gutenberg version compatibility
	if ( typeof settings.attributes !== 'undefined' ) {
		
		return assign( {}, settings, {
			attributes: merge(settings.attributes, {
				revealControls: {
					type: 'object',
					default: null
				}
			})
		} );
	}
	return settings;
}


/**
 * Add block reveal controls to Block Panel.
 *
 * @param {function} BlockEdit Block edit component.
 *
 * @return {function} BlockEdit Modified block edit component.
 */
const withBlockRevealControls = createHigherOrderComponent( (BlockEdit) => {
	return (props) => {

		const {
			attributes,
			setAttributes,
			clientId
		} = props;
		
		const {
			revealControls
		} = attributes;

		const defaultRevealControls = {
			effect: '',
			permanent: true,
			delay: 0,
			duration: 400,
			easing: 'default'
		};

		const { previewBlock, removePreview } = useDispatch(PREVIEW_STORE);

		// Initiate Reveal preview
		const handlePreview = () => {
			previewBlock(clientId);
			setTimeout(() => removePreview(clientId), 100);
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
						className={ 'block-editor-panel-reveal' }
						title={ __('Reveal on scroll', "tzm-block-reveal-controls") }
						initialOpen={ false }
					>
						<PanelRow>
							<SelectControl __nextHasNoMarginBottom __next40pxDefaultSize
								className="select-control__effect"
								label={ __('Animation', "tzm-block-reveal-controls") }
								value={ revealControls?.effect ?? defaultRevealControls.effect }
								options={ [
									{ label: __('- Disabled -', "tzm-block-reveal-controls"), value: '' },
									{ label: __('Fade', "tzm-block-reveal-controls"), value: 'fade' },
									{ label: __('Slide up', "tzm-block-reveal-controls"), value: 'slide-up' },
									{ label: __('Slide down', "tzm-block-reveal-controls"), value: 'slide-down' },
									{ label: __('Slide left', "tzm-block-reveal-controls"), value: 'slide-left' },
									{ label: __('Slide right', "tzm-block-reveal-controls"), value: 'slide-right' },
									{ label: __('Rotate', "tzm-block-reveal-controls"), value: 'rotate' },
									{ label: __('Zoom in', "tzm-block-reveal-controls"), value: 'zoom-in' },
									{ label: __('Zoom out', "tzm-block-reveal-controls"), value: 'zoom-out' }
								] }
								onChange={ (newValue) => {
									handlePreview();
									updateAttribute({ ...revealControls, effect: newValue });
								} }
								suffix={ 
									<Button variant="secondary" 
										className="components-button__preview"
										disabled={!revealControls?.effect} 
										onClick={ handlePreview }
										>
											{ __('Preview', "tzm-block-reveal-controls") }
									</Button> 
								}
							/>
							
						</PanelRow>
						{ !! revealControls?.effect && (
						<>
							<PanelRow>
								<ToggleControl __nextHasNoMarginBottom
									className="toggle-control__permanent"
									label={ __('Reveal permanently', "tzm-block-reveal-controls") }
									help={ __('Enable this option to keep the block permanently visible when it has been revealed once.', "tzm-block-reveal-controls") }
									checked={ !! revealControls?.permanent ?? defaultRevealControls.permanent }
									onChange={ (newValue) => updateAttribute({ ...revealControls, permanent: newValue }) }
								/>
							</PanelRow>
							<PanelRow>
								<SelectControl __nextHasNoMarginBottom __next40pxDefaultSize
									className="select-control__easing"
									label={ __('Animation easing', "tzm-block-reveal-controls") }
									value={ revealControls?.easing ?? defaultRevealControls.easing }
									options={ [
										{ label: __('Default', "tzm-block-reveal-controls"), value: 'default' },
										{ label: __('Linear', "tzm-block-reveal-controls"), value: 'linear' },
										{ label: __('Sine', "tzm-block-reveal-controls"), value: 'sine' },
										{ label: __('Cubic', "tzm-block-reveal-controls"), value: 'cubic' },
										{ label: __('Quint', "tzm-block-reveal-controls"), value: 'quint' },
										{ label: __('Back', "tzm-block-reveal-controls"), value: 'back' }
									] }
									onChange={ (newValue) => updateAttribute({ ...revealControls, easing: newValue }) }
								/>
							</PanelRow>
							<PanelRow>
								<RangeControl __nextHasNoMarginBottom __next40pxDefaultSize
									className="range-control__duration"
									label={ __('Reveal duration (in ms)', "tzm-block-reveal-controls") }
									value={ revealControls?.duration ?? defaultRevealControls.duration }
									onChange={ (newValue) => updateAttribute({ ...revealControls, duration: newValue }) }
									step={ 100 }
									min={ 100 }
									max={ 2500 }
									marks={[
										{value: 100},
										{value: 500},
										{value: 1000},
										{value: 1500},
										{value: 2000},
										{value: 2500}
									]}
								/>
							</PanelRow>
							<PanelRow>
								<RangeControl __nextHasNoMarginBottom __next40pxDefaultSize
									className="range-control__delay"
									label={ __('Reveal delay (in ms)', "tzm-block-reveal-controls") }
									value={ revealControls?.delay ?? defaultRevealControls.delay }
									onChange={ (newValue) => updateAttribute({ ...revealControls, delay: newValue }) }
									step={ 150 }
									min={ 0 }
									max={ 3000 }
									marks={[ 
										{value: 0},
										{value: 600},
										{value: 1200},
										{value: 1800},
										{value: 2400},
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
}, 'withBlockRevealControls');


/**
 * Add reveal classes to the block in the editor
 */
const addBlockRevealPropsEditor = createHigherOrderComponent( (BlockListBlock) => {
	return (props) => {

		const {
			attributes,
			className,
			clientId,
		} = props;

		const { revealControls } = attributes;

		// Use useSelect to get the highlight state for the current block.
		const isPreviewed = useSelect(
			(select) => select(PREVIEW_STORE).isBlockPreviewed(clientId),
			[clientId]
		);

		// WIP: Get the `blockRevealLivePreview` setting
		/*const isLivePreview = useSelect(
			(select) => select('core/preferences').get('tzm', 'blockRevealLivePreview', false),
			[]
		);*/

		// Set block reveal properties
		let revealClasses = [];
		let revealStyles = {};

		/*if (!isLivePreview)*/ revealClasses.push('is-visible');

		if (revealControls?.effect) {
			Object.entries(revealControls).forEach(([option, value]) => {
				switch (option) {
					case 'effect':
						revealClasses.push(`tzm-block-reveal__${value}`);
						break;
					case 'permanent':
						revealClasses.push('tzm-block-reveal__permanent');
						break;
					case 'easing':
						revealClasses.push(`tzm-block-reveal__ease-${value}`);
						break;
					case 'duration':
						revealStyles['--tzm-block-reveal--duration'] = `${value}ms`;
						break;
					case 'delay':
						revealStyles['--tzm-block-reveal--delay'] = `${value}ms`;
						break;
				}
			});
	
			if (isPreviewed) {
				revealClasses.push('is-reveal-preview');
			}
		}

		// WIP: *Experimental* Live Preview
		/*if (isLivePreview) {
			return (
				<BlockListBlockWithIO
					BlockListBlock={BlockListBlock}
					revealClasses={revealClasses}
					revealStyles={revealStyles}
					{...props}
				/>
			);
		}*/

		return ( 
			<BlockListBlock	{ ...props } 
				className={ clsx(className, revealClasses) }
				wrapperProps={ { ...props.wrapperProps, style: revealStyles } }
			/>
		);
	}
}, 'addBlockRevealPropsEditor' );


/**
 * WIP: Add an option to enable Block Reveal live preview.
 * 
 * @return {Object} Component to toggle 'enableLivePreview' preference
 */
/*const LivePreviewButton = () => {
    const { set } = useDispatch('core/preferences');

    const livePreview = useSelect(
        (select) => select('core/preferences').get('tzm', 'blockRevealLivePreview', false),
        []
    );

    const togglePreference = () => {
		console.log(livePreview ? 'disabling livePreview' : 'enabling livePreview');
        set('tzm', 'blockRevealLivePreview', !livePreview);
    };

	return (
		<PluginMoreMenuItem
			icon={ livePreview ? check : 'none' }
			onClick={ togglePreference }
		>
		{  __("Reveal blocks live (experimental)", 'tzm-responsive-block-controls') }
		</PluginMoreMenuItem>
	)
};*/


// Add block reveal attribute
addFilter(
	'blocks.registerBlockType',
	'tzm/block-reveal-attribute',
	addBlockRevealAttribute
);

// Add block reveal controls
addFilter(
	'editor.BlockEdit',
	'tzm/block-reveal-controls',
	withBlockRevealControls
);

// Add block reveal props (backend)
addFilter(
   'editor.BlockListBlock',
   'tzm/block-reveal-styles',
   addBlockRevealPropsEditor
);

// WIP: Add option to toggle displaying hidden blocks
/*registerPlugin(
	'tzm-block-reveal-controls-live-preview', 
	{ render: LivePreviewButton } 
);*/
