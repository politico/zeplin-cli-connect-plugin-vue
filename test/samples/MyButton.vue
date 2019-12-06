<script>
import MyIcon from './MyIcon'

/**
 * General component description
 */
export default {
	name: 'MyButton',
	components: {
		MyIcon
	},
	props: {
		/**
		 * Background color
		 * Options: 'dark' | 'light' | 'blue'
		 */
		color: {
			type: String,
			default: 'dark'
		},
		/**
		 * Whether the button is disabled;
		 * certain styles are applied to disabled buttons, in addition to making them non-clickable
		 */
		disabled: {
			type: Boolean,
			default: false
		},
		/**
		 * If the purpose of the component is to link to a real URL (outside of the current application),
		 * specify that URL here. Can use the native `target` attribute to open links in a new tab, if desired
		 */
		href: {
			type: String,
			default: ''
		},
		/**
		 * Name of the icon that should be displayed along with the button text
		 * Placement in relation to the button text determined by `iconPlacement` prop
		 * Options: see `MyIcon` story
		 */
		icon: {
			type: String,
			default: ''
		},
		/**
		 * Which side of the button text an icon
		 * (if there is one specified by the `icon` prop) should appear on
		 * Options: 'right' | 'left'
		 */
		iconPlacement: {
			type: String,
			default: 'right'
		},
		/**
		 * Consuming component can pass props for icon
		 * All the props accepted by MyIcon can be passeed as Object
		 * e.g. `{ width: 20, height: 20, solid: true }`
		 */
		iconProps: {
			type: Object,
			default: () => ({})
		},
		/**
		 * Text for the button can either be specified using this prop
		 * (in which case the component can be self-closing, because no slot is needed),
		 * or if the content is more complex than plain text, the component default slot can be used
		 */
		label: {
			type: String,
			default: ''
		},
		/**
		 * Size (in particular, padding around text)
		 * Options: 'sm' | 'md' | 'lg'
		 */
		size: {
			type: String,
			default: 'md'
		},
		/**
		 * If the purpose of the component is to link to another Vue route, specify that route here
		 * Can be either a string path, e.g. `/my-route`,
		 * or a Vue router Object, e.g. `{ name: 'MyRouteName' }`
		 */
		to: {
			type: [String, Object],
			default: ''
		}
	},
	computed: {
		component() {
			return this.to ? 'router-link' : this.href ? 'a' : 'button'
		},
		buttonClasses() {
			return {
				'pro-button': true,
				[`pro-button--${this.size}`]: true,
				[`pro-button--${this.color}`]: true,
				[`pro-button--icon-${this.iconPlacement}`]:
					this.iconPlacement && !this.isIconOnly,
				'pro-button--icon-only': this.isIconOnly
			}
		},
		isIconOnly() {
			return this.icon && !this.label && !this.slotHasText
		},
		slotHasText() {
			return !!(
				this.$slots.default &&
				this.$slots.default[0] &&
				this.$slots.default[0].text &&
				this.$slots.default[0].text.trim().length
			)
		}
	},
	methods: {
		onClick(e) {
			if (this.disabled) {
				e.preventDefault()
				return
			}
			/**
			 * Emit standard click event
			 * @type {object}
			 */
			this.$emit('click', e)
		}
	}
}
</script>

<template>
	<component
		:is="component"
		:to="to"
		:href="href"
		:disabled="disabled"
		:class="buttonClasses"
		@click="onClick($event)"
	>
		<!-- @slot If no content is passed into this default slot,
		then the `label` prop is used as the button content -->
		<slot>{{ label }}</slot>
		<MyIcon
			v-if="icon"
			:name="icon"
			v-bind="iconProps"
			aria-hidden="true"
			class="pro-button__icon"
		/>
		<span v-else class="pro-button__icon-placeholder" />
	</component>
</template>

<style lang="scss" scoped>
$default-icon-height: 20px;

@mixin buttonPadding($button-size, $vertical, $horizontal) {
	&--#{$button-size} {
		padding: $vertical $horizontal;
	}
	&--#{$button-size}#{&}--icon-only {
		padding: $vertical;
	}
}

.pro-button {
	align-items: center;
	border: none;
	border-radius: 100rem;
	cursor: pointer;
	display: inline-flex;
	font-size: 0.75rem;
	font-weight: bold;
	justify-content: center;
	letter-spacing: 0.1rem;
	text-transform: uppercase;
	white-space: nowrap;

	// Different Sizes of the button
	@include buttonPadding('sm', $spacer/6, $spacer/3);
	@include buttonPadding('md', $spacer/3, $spacer * 2/3);
	@include buttonPadding('lg', $spacer/2, $spacer);

	// Different Colors for buttons
	&--dark {
		background: $cVulcanGray20;
		color: #fff;
	}
	&--blue {
		background: $cDenimBlue39;
		color: #fff;
	}

	&--light {
		background: $cVulcanGray91;
		color: $cVulcanGray20;
	}

	&:disabled {
		cursor: default;

		&:not(.loading) {
			background: $cVulcanGray91;
			color: rgba($cVulcanGray20, 0.5);
		}
	}

	.pro-button__icon {
		flex: none;
	}

	.pro-button__icon-placeholder {
		flex: none;
		height: $default-icon-height;
	}

	// Different icon placements for buttons
	&--icon-right {
		flex-direction: row;

		.pro-button__icon {
			margin-left: $spacer/4;
		}
	}
	&--icon-left {
		flex-direction: row-reverse;

		.pro-button__icon {
			margin-right: $spacer/4;
		}
	}
}
</style>
