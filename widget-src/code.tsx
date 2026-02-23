const { widget } = figma
const { AutoLayout, Text, Input, useSyncedState } = widget

function HelloWorldWidget() {
  const [inputText, setInputText] = useSyncedState('inputText', '')
  const [displayText, setDisplayText] = useSyncedState('displayText', '')
  const [isChecked, setIsChecked] = useSyncedState('isChecked', false)

  return (
    <AutoLayout 
      direction="vertical"
      padding={24} 
      spacing={16}
      fill="#FFFFFF" 
      cornerRadius={8}
      stroke="#E5E5E5"
      width={300}
    >
      <Text fontSize={24} fontWeight="bold">
        Hello world
      </Text>
      
      <Input
        value={inputText}
        placeholder="Type something here..."
        onTextEditEnd={(e) => setInputText(e.characters)}
        fontSize={16}
        fill="#333333"
        width="fill-parent"
        inputBehavior="multiline"
      />

      <AutoLayout 
        fill="#18A0FB" 
        padding={{ vertical: 8, horizontal: 16 }} 
        cornerRadius={6}
        onClick={() => {
          setDisplayText(inputText);
          setInputText(''); // Clear the input
          setIsChecked(false); // Reset checkbox when new text is submitted
        }}
        hoverStyle={{ fill: "#0D8BD8" }}
      >
        <Text fill="#FFFFFF" fontWeight="bold" fontSize={14}>
          Submit
        </Text>
      </AutoLayout>

      {displayText.length > 0 && (
        <AutoLayout 
          padding={12} 
          fill="#F5F5F5" 
          cornerRadius={4} 
          width="fill-parent"
          verticalAlignItems="center"
          spacing={12}
          onClick={() => setIsChecked(!isChecked)}
          hoverStyle={{ fill: "#EBEBEB" }}
        >
          {/* Custom Checkbox Box */}
          <AutoLayout
            width={20}
            height={20}
            cornerRadius={4}
            fill={isChecked ? "#18A0FB" : "#FFFFFF"}
            stroke={isChecked ? "#18A0FB" : "#CCCCCC"}
            strokeWidth={1.5}
            horizontalAlignItems="center"
            verticalAlignItems="center"
          >
            {isChecked && (
              <Text fill="#FFFFFF" fontSize={14} fontWeight="bold" horizontalAlignText="center" verticalAlignText="center">
                ✓
              </Text>
            )}
          </AutoLayout>

          {/* Task Text */}
          <Text 
            fontSize={14} 
            fill={isChecked ? "#888888" : "#333333"}
            textDecoration={isChecked ? "strikethrough" : "none"}
            width="fill-parent"
          >
            {displayText}
          </Text>
        </AutoLayout>
      )}
    </AutoLayout>
  )
}

widget.register(HelloWorldWidget)