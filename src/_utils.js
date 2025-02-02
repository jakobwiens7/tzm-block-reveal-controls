/**
 * External dependencies
 */
import { isEmpty, isObject, identity, mapValues, pickBy } from 'lodash';


/**
 * Utility function to check if an object has any nested value.
 * 
 * @param {object} 	obj		The object to check.
 * 
 * @return {boolean}		True if any child value is truthy, otherwise false.
 */
export function hasNestedValue( object ) {
    if (!object || typeof object !== "object") return false; // Return false for null, undefined, or non-objects

    return Object.values(object).some(value => {
        if (typeof value === "object" && value !== null) {
            // Recursive call for nested objects
            return hasNestedValue(value);
        }
        return !!value; // Check if the value is truthy
    });
}


/**
 * Removed empty nodes from nested objects.
 *
 * @param {Object} object
 * @return {Object} Object cleaned from empty nodes.
 */
export const cleanEmptyObject = ( object ) => {
	if ( ! isObject( object ) || Array.isArray( object ) ) return object;
	
    // Custom filter function to exclude only null, undefined, false and empty string values
    const isNotEmptyValue = (value) => value !== null && value !== undefined && value !== '' && value !== false;
	
	const cleanedNestedObjects = pickBy(
		mapValues( object, cleanEmptyObject ),
		//identity
		isNotEmptyValue
	);
	return isEmpty( cleanedNestedObjects ) ? undefined : cleanedNestedObjects;
};