<script>
// Architecture ideas taken from
// https://github.com/MMF-FE/vue-svgicon

/** Sample svgs */
const SVG_TYPES = {
    bookmark: 'sample text',
    news: 'sample text',
}

/**
 * General component description
 */
export default {
	name: 'MyIcon',
	props: {
		name: {
			type: String,
			required: true
		},
		width: {
			type: Number,
			required: false,
			default: null
		},
		height: {
			type: Number,
			required: false,
			default: null
		},
		title: {
			type: String,
			default: ''
		},
		solid: {
			type: Boolean,
			required: false,
			default: false
		}
	},
	computed: {
		iconData() {
			return SVG_TYPES[this.name]
		},
		path() {
			if (this.iconData) {
				return this.solid && this.iconData.solidPath
					? this.iconData.solidPath
					: this.iconData.path
			}
			return ''
		},
		calculatedWidth() {
			return this.width ? this.width : this.iconData && this.iconData.width
		},
		calculatedHeight() {
			return this.height ? this.height : this.iconData && this.iconData.height
		},
		calculatedBox() {
			return this.iconData && this.iconData.box
				? this.iconData.box
				: `0 0 ${this.calculatedWidth} ${this.calculatedHeight} `
		}
	}
}
</script>

<template>
	<svg
		v-if="iconData"
		:width="`${calculatedWidth}px`"
		:height="`${calculatedHeight}px`"
		:viewBox="calculatedBox"
		:aria-labelledby="title ? title : name"
		xmlns="http://www.w3.org/2000/svg"
		role="presentation"
		version="1.1"
		class="icon"
		v-on="$listeners"
	>
		<rect
			width="100%"
			height="100%"
			fill="transparent"
			stroke="transparent"
			stroke-width="0"
		>
			<title :id="title ? title : name" lang="en">{{ title || name }}</title>
		</rect>
		<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
			<!-- eslint-disable vue/no-v-html -->
			<!-- Since we control all icon .js files, we don't need to worry about XSS issues -->
			<g fill="currentColor" v-html="path" />
			<!-- eslint-enable -->
		</g>
	</svg>
</template>
