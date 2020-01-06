<script>
export default {
	name: 'MyLightweightComponent',
	props: {
		simpleProp: {
			type: String,
			default: 'some string'
		}
    },
    methods: {
        emitSimpleEvent(event) {
            this.$emit('simple-event', event)
        }
    }
}
</script>

<template>
	<div>
		<slot>Default content for default slot</slot>
        <slot name="simpleSlot" :slotBinding="slotBinding">{{ slotBinding.someValue }}</slot>
		<button @click="emitSimpleEvent">Simple Button</button>
	</div>
</template>