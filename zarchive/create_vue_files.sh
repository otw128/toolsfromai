#!/bin/bash

# Get current folder name
FOLDER_NAME=$(basename "$(pwd)")

# Capitalize first letter of folder name
FOLDER_NAME_CAPITALIZED="${FOLDER_NAME^}"

# Create 4 Vue files based on folder name
for suffix in Cg Gm Qw Yb; do
    FILENAME="${FOLDER_NAME_CAPITALIZED}${suffix}.vue"
    
    # Create basic Vue template
    cat > "$FILENAME" << EOF
<template>
  <div class="container">
    <h1>{{ title }}</h1>
    <p>This Vue component was automatically created.</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const title = ref('${FOLDER_NAME_CAPITALIZED} - ${suffix}')
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 50px auto;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

h1 {
  color: #333;
}
</style>
EOF
    
    echo "Created: $FILENAME"
done

echo ""
echo "Successfully created 4 Vue files:"
ls -la "${FOLDER_NAME_CAPITALIZED}"{Cg,Gm,Qw,Yb}".vue"
