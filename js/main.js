document.addEventListener('DOMContentLoaded', function() {
    // Initialize CodeMirror editor
    const codeEditor = CodeMirror.fromTextArea(document.getElementById('code-editor'), {
        mode: 'javascript',
        theme: 'monokai',
        lineNumbers: true,
        gutters: ["CodeMirror-linenumbers"],
        fixedGutter: true,
        cursorBlinkRate: 530, // Standard cursor blink rate
        cursorHeight: 1.0,    // Ensure proper cursor height
        cursorScrollMargin: 5,
        autoRefresh: true,
        autoCloseBrackets: true,
        matchBrackets: true,
        indentUnit: 4,
        tabSize: 4,
        indentWithTabs: false,
        lineWrapping: true,
        viewportMargin: Infinity
    });

    // Resize editor to fit container
    codeEditor.setSize('100%', '100%');

    // Navigation functionality
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('.section');

    // Function to handle section navigation
    function navigateToSection(targetId) {
        // Remove active class from all links
        navLinks.forEach(link => link.classList.remove('active'));

        // Add active class to corresponding nav link
        document.querySelector(`.nav-links a[href="#${targetId}"]`).classList.add('active');

        // Hide all sections
        sections.forEach(section => section.classList.remove('active'));

        // Show the target section
        document.getElementById(targetId).classList.add('active');
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            navigateToSection(targetId);
        });
    });

    // Add event listeners to CTA buttons on homepage
    const ctaButtons = document.querySelectorAll('.cta-buttons a');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            navigateToSection(targetId);
        });
    });

    // Documentation navigation
    const docLinks = document.querySelectorAll('.doc-link');
    const docSections = document.querySelectorAll('.doc-section');
    
    // Documentation navigation buttons
    const docNavButtons = document.querySelectorAll('.doc-nav-btn');

    // Add event listeners for navigation buttons
    docNavButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the target section id
            const targetId = this.getAttribute('href').substring(1);
            
            // Update sidebar navigation
            docLinks.forEach(link => link.classList.remove('active'));
            document.querySelector(`.doc-link[href="#${targetId}"]`).classList.add('active');
            
            // Hide all doc sections
            docSections.forEach(section => section.classList.remove('active'));
            
            // Show the target section
            document.getElementById(targetId).classList.add('active');
        });
    });

    docLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            // Remove active class from all links
            docLinks.forEach(link => link.classList.remove('active'));

            // Add active class to clicked link
            this.classList.add('active');

            // Get the target section id
            const targetId = this.getAttribute('href').substring(1);

            // Hide all sections
            docSections.forEach(section => section.classList.remove('active'));

            // Show the target section
            document.getElementById(targetId).classList.add('active');
        });
    });

    // Run button functionality
    const runButton = document.getElementById('run-button');
    const output = document.getElementById('output');

    runButton.addEventListener('click', function() {
        const code = codeEditor.getValue();
        executeOrusCode(code);
    });

    // Clear button functionality
    const clearButton = document.getElementById('clear-button');

    clearButton.addEventListener('click', function() {
        codeEditor.setValue('print("Hello, World!")');
        output.textContent = '';
    });

    // Example selector functionality
    const exampleSelect = document.getElementById('example-select');
    const examples = {
        'hello-world': '// The classic Hello World program\nprint("Hello, World!");',
        
        'variables': `// Tests variable assignments
let x: i32 = 10
let y: i32 = 20

print("Initial values:")
print(x)
print(y)

x = 30
print("After first assignment:")
print(x)

y = 40
print("After second assignment:")
print(y)

// Advanced assignments 
y = 50
x = y
print("After assignment:")
print(x)
print(y)

x = x + 5
print("After expression assignment:")
print(x)`,

        'variable-types': `// Tests variable declarations with different types
let i32_var: i32 = 42
let u32_var: u32 = 100
let f64_var: f64 = 3.14
let bool_var: bool = true
let inferred_i32 = 24
let inferred_u32 = 200
let inferred_f64 = 2.71

print("Variable declaration test:")
print(i32_var) 
print(u32_var)
print(f64_var)
print(bool_var)
print(inferred_i32)
print(inferred_u32)
print(inferred_f64)`,
        
        'complex-expressions': `// Test complex expressions with mixed operations and precedence
print("Complex Expressions Test:")

// Test operator precedence
print("2 + 3 * 4 = {}", 2 + 3 * 4)

// Test parentheses
print("(2 + 3) * 4 = {} ", (2 + 3) * 4)

// Test mixed operators
print("10 - 2 * 3 + 4 / 2 = {}", 10 - 2 * 3 + 4 / 2)

// Complex with mixed values
print("5 * 3 + 5 / 2 - 3 % 2 = {} ", 5 * 3 + 5 / 2 - 3 % 2)

// Mixed types
print("10 * 2.5 = {} ", 10 * 2.5)`,
        
        'float-operations': `// Test floating point arithmetic operations
// Explicit operations instead of variable assignments
print("f64 Operations:")

// Addition
print("10.5 + 3.2 = {} ", 10.5 + 3.2)

// Subtraction
print("10.5 - 3.2 = {} ", 10.5 - 3.2)

// Multiplication
print("10.5 * 3.2 = {} ", 10.5 * 3.2)

// Division
print("10.5 / 3.2 = {} ", 10.5 / 3.2)

// Negation
print("-10.5 = {} ", -10.5)`,
        
        'int-operations': `// Test basic integer arithmetic operations
// Explicit operations instead of variable assignments
print("i32 Operations:")

// Addition
print("10 + 3 = {} ", 10 + 3)

// Subtraction
print("10 - 3 = {} ", 10 - 3)

// Multiplication
print("10 * 3 = {} ", 10 * 3)

// Division
print("10 / 3 = {} ", 10 / 3)

// Modulo
print("10 % 3 = {} ", 10 % 3)

// Negation
print("-10 = {} ", -10)`,
        
        'sorting-algorithms': `struct Sorter {}

impl Sorter {
    fn bubble_sort(arr: [i32; 8]) -> [i32; 8] {
        let n: i32 = 8
        let i: i32 = 0
        let j: i32 = 0
        let temp: i32 = 0
        let swapped: bool = false
        
        // Create a copy to maintain immutability of original array
        let sorted: [i32; 8] = [0, 0, 0, 0, 0, 0, 0, 0]
        for i in 0..n {
            sorted[i] = arr[i]
        }
        
        // Bubble sort algorithm
        for i in 0..n-1 {
            swapped = false
            for j in 0..n-i-1 {
                if sorted[j] > sorted[j+1] {
                    // Swap elements
                    temp = sorted[j]
                    sorted[j] = sorted[j+1]
                    sorted[j+1] = temp
                    swapped = true
                }
            }
            
            // If no swaps were made in this pass, array is sorted
            if swapped == false {
                break
            }
        }
        
        return sorted
    }
    
    fn selection_sort(arr: [i32; 8]) -> [i32; 8] {
        let n: i32 = 8
        let i: i32 = 0
        let j: i32 = 0
        let min_idx: i32 = 0
        let temp: i32 = 0
        
        // Create a copy to maintain immutability of original array
        let sorted: [i32; 8] = [0, 0, 0, 0, 0, 0, 0, 0]
        for i in 0..n {
            sorted[i] = arr[i]
        }
        
        // Selection sort algorithm
        for i in 0..n-1 {
            min_idx = i
            
            for j in i+1..n {
                if sorted[j] < sorted[min_idx] {
                    min_idx = j
                }
            }
            
            // Swap the found minimum element with the element at index i
            if min_idx != i {
                temp = sorted[i]
                sorted[i] = sorted[min_idx]
                sorted[min_idx] = temp
            }
        }
        
        return sorted
    }
    
    fn is_sorted(arr: [i32; 8]) -> bool {
        let i: i32 = 1
        while i < 8 {
            if arr[i-1] > arr[i] {
                return false
            }
            i = i + 1
        }
        return true
    }
}

fn array_to_string(arr: [i32; 8]) -> string {
    let result: string = "["
    for i in 0..8 {
        result = result + arr[i]
        if i < 7 {
            result = result + ", "
        }
    }
    result = result + "]"
    return result
}

// Test arrays to sort
let unsorted1: [i32; 8] = [64, 34, 25, 12, 22, 11, 90, 5]
let unsorted2: [i32; 8] = [5, 1, 4, 2, 8, 9, 3, 7]

// Sort and print results
print("Original array 1: {}", array_to_string(unsorted1))
let bubble_sorted: [i32; 8] = Sorter.bubble_sort(unsorted1)
print("Bubble sorted: {}", array_to_string(bubble_sorted))
print("Is bubble sorted: {}", Sorter.is_sorted(bubble_sorted))

print("Original array 2: {}", array_to_string(unsorted2))
let selection_sorted: [i32; 8] = Sorter.selection_sort(unsorted2)
print("Selection sorted: {}", array_to_string(selection_sorted))
print("Is selection sorted: {}", Sorter.is_sorted(selection_sorted))`,
        
        'float-comparison': `// Test floating point comparison operations

let a: f64 = 10.5
let b: f64 = 20.7
let c: f64 = 10.5

print("f64 Comparisons:")

print("10.5 == 20.7 is: {} ", a == b)

print("10.5 == 10.5 is: {} ", a == c)

print("10.5 != 20.7 is {} ", a != b)

print("10.5 < 20.7 is: {}", a < b)

print("10.5 <= 20.7 is: {} ", a <= b)

print("10.5 <= 10.5 is: {} ", a <= c)

print("10.5 > 20.7 is: {} ", a > b)

print("10.5 >= 20.7 is: {} ", a >= b)

print("10.5 >= 10.5 is: {} ", a >= c)`,
        
        'int-comparison': `// Test integer comparison operations
let a: i32 = 10
let b: i32 = 20
let c: i32 = 10

print("i32 Comparisons:")

print("10 == 20 is: {}", a == b)

print("10 == 10 is: {} ", a == c)

print("10 != 20 is: {} ", a != b)

print("10 < 20 is: {} ", a < b)

print("10 <= 20 is: {} ", a <= b)

print("10 <= 10 is: {} ", a <= c)

print("10 > 20 is: {} ", a > b)

print("10 >= 20 is: {}", a >= b)

print("10 >= 10 is: {} ", a >= c)`,
        
        'break-test': `// Test break statement in loops
let sum = 0

print("Break Test in While Loop:")

let i = 0
while i < 10 {
    i = i + 1
    if i == 6 {
        print("Breaking at i =")
        print(i)
        break
    }
    sum = sum + i
    print("Added")
    print(i)
    print("Sum =")
    print(sum)
}

print("Final sum after break:")
print(sum)

// Test break in for loop
print("Break Test in For Loop:")
sum = 0

for j in 1..10 {
    if j == 6 {
        print("Breaking at j =")
        print(j)
        break
    }
    sum = sum + j
    print("Added")
    print(j)
    print("Sum =")
    print(sum)
}

print("Final sum after break:")
print(sum)`,
        
        'continue-test': `// Test continue statement in loops

let sum = 0

print("Continue Test in While Loop:")

let i = 0
while i < 10 {
    i = i + 1
    if i % 2 == 0 {
        print("Skipping even number:")
        print(i)
        continue
    }
    sum = sum + i
    print("Added odd number:")
    print(i)
    print("Sum =")
    print(sum)
}

print("Final sum of odd numbers:")
print(sum)

// Test continue in for loop
print("Continue Test in For Loop:")
sum = 0

for j in 1..10 {
    if j % 2 == 0 {
        print("Skipping even number:")
        print(j)
        continue
    }
    sum = sum + j
    print("Added odd number:")
    print(j)
    print("Sum =")
    print(sum)
}

print("Final sum of odd numbers:")
print(sum)`,
        
        'for-loop': `// Test for loop control flow
let sum = 0

print("For Loop Test:")

for i in 1..5 {
    print("Iteration:")
    print(i)
    sum = sum + i
    print("Current sum:")
    print(sum)
}

print("Final sum:")
print(sum)`,
        
        'if-else': `// Test if-else control flow
let x = 10
let y = 20
let result = 0

print("If-Else Test:")

if x > y {
    result = 1
    print("x is greater than y")
} else {
    result = 2
    print("x is not greater than y")
}

// Test with elif
if x > y {
    print("x is greater than y")
} elif x < y {
    print("x is less than y")
} else {
    print("x is equal to y")
}`,
        
        'nested-loops': `// Test nested loops with break using logical operators
let sum = 0

print("Nested Loops Test with Logical Operators:")

// Outer loop
for i in 0..3 {
    print("Outer i =")
    print(i)
    
    // Inner loop
    for j in 0..3 {
        print("  Inner j =")
        print(j)
        
        // Skip combination using logical AND operator
        if i == 1 and j == 1 {
            print("  Skipping i=1, j=1")
        } else {
            // Break from inner loop using logical OR operator
            if i == 2 or j == 2 {
                print("  Breaking on i=2 or j=2")
                break
            }
            
            sum = sum + (i * 10 + j)
            print("  Sum +=")
            print(i * 10 + j)
            print("  Sum =")
            print(sum)
        }
    }
}

print("Final sum:")
print(sum)`,
        
        'while-loop': `// Test while loop control flow

let count = 0
let sum = 0

print("While Loop Test:")

while count < 5 {
    count = count + 1
    sum = sum + count
    print("Iteration:")
    print(count)
    print("Current sum:")
    print(sum)
}

print("Final sum:")
print(sum)`,
        
        'data-structures': `// Implementation of Stack and Queue data structures using arrays and structs

// A simple Stack implementation
struct Stack {
    data: [i32; 10],
    top: i32
}

impl Stack {
    fn new() -> Stack {
        return Stack{
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            top: -1
        }
    }
    
    fn push(self, value: i32) -> bool {
        if self.top >= 9 {
            // Stack overflow
            return false
        }
        
        self.top = self.top + 1
        self.data[self.top] = value
        return true
    }
    
    fn pop(self) -> i32 {
        if self.top < 0 {
            // Stack underflow
            return -1
        }
        
        let value: i32 = self.data[self.top]
        self.top = self.top - 1
        return value
    }
    
    fn peek(self) -> i32 {
        if self.top < 0 {
            return -1
        }
        return self.data[self.top]
    }
    
    fn is_empty(self) -> bool {
        return self.top < 0
    }
    
    fn size(self) -> i32 {
        return self.top + 1
    }
}

// A simple Queue implementation
struct Queue {
    data: [i32; 10],
    front: i32,
    rear: i32,
    count: i32
}

impl Queue {
    fn create() -> Queue {
        return Queue{
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            front: 0,
            rear: -1,
            count: 0
        }
    }
    
    fn enqueue(self, value: i32) -> bool {
        if self.count >= 10 {
            // Queue is full
            return false
        }
        
        self.rear = (self.rear + 1) % 10
        self.data[self.rear] = value
        self.count = self.count + 1
        return true
    }
    
    fn dequeue(self) -> i32 {
        if self.count <= 0 {
            // Queue is empty
            return -1
        }
        
        let value: i32 = self.data[self.front]
        self.front = (self.front + 1) % 10
        self.count = self.count - 1
        return value
    }
    
    fn peek(self) -> i32 {
        if self.count <= 0 {
            return -1
        }
        return self.data[self.front]
    }
    
    fn is_empty(self) -> bool {
        return self.count == 0
    }
    
    fn size(self) -> i32 {
        return self.count
    }
}

// Test the Stack implementation
let stack: Stack = Stack.new()
print("Stack created, isEmpty: {}", stack.is_empty())

stack.push(10)
stack.push(20)
stack.push(30)
print("Stack size after pushes: {}", stack.size())
print("Stack top element: {}", stack.peek())

let popped: i32 = stack.pop()
print("Popped from stack: {}", popped)
print("Stack size after pop: {}", stack.size())
print("New stack top: {}", stack.peek())

// Test the Queue implementation
let queue: Queue = Queue.create()
print("Queue created, isEmpty: {}", queue.is_empty())

queue.enqueue(10)
queue.enqueue(20)
queue.enqueue(30)
print("Queue size after enqueues: {}", queue.size())
print("Queue front element: {}", queue.peek())

let dequeued: i32 = queue.dequeue()
print("Dequeued from queue: {}", dequeued)
print("Queue size after dequeue: {}", queue.size())
print("New queue front: {}", queue.peek())`,
        
        'advanced-functions': `// Test advanced function features in Orus

// Recursive function
fn factorial(n: i32) -> i32 {
    if n <= 1 {
        return 1
    } else {
        return n * factorial(n - 1)
    }
}

// Function with multiple return paths
fn max(a: i32, b: i32) -> i32 {
    if a > b {
        return a
    }
    return b
}

// Function that returns a boolean
fn isEven(num: i32) -> bool {
    return num % 2 == 0
}

print("Advanced Function Tests:")

// Test recursive function
print("Factorial of 5:")
let n5 = 5
let fact5 = factorial(n5)
print(fact5)

// Test function with multiple return paths
print("Maximum of 42 and 17:")
let a1 = 42
let b1 = 17
let maxResult1 = max(a1, b1)
print(maxResult1)

print("Maximum of 13 and 37:")
let a2 = 13
let b2 = 37
let maxResult2 = max(a2, b2)
print(maxResult2)

// Test boolean returning function
print("Is 10 even?")
let num1 = 10
let even10 = isEven(num1)
print(even10)

print("Is 7 even?")
let num2 = 7
let even7 = isEven(num2)
print(even7)

// Test function composition
print("Function composition - max(factorial(3), factorial(2)):")
let n3 = 3
let n2 = 2
let fact3 = factorial(n3)
let fact2 = factorial(n2)
let composed = max(fact3, fact2)
print(composed)`,
        
        'basic-functions': `// Test basic function support in Orus

// Simple function without parameters
fn sayHello() {
    print("Hello from a function!")
}

// Function with parameters
fn add(a: i32, b: i32) -> i32 {
    return a + b
}

// Function with multiple statements and return value
fn calculateSum(n: i32) -> i32 {
    let sum = 0
    for i in 1..n+1 {
        sum = sum + i
    }
    return sum
}

print("Basic Function Tests:")

// Call the functions
sayHello()
print(add(5, 7))
print(calculateSum(5))`,
        
        'string-interpolation': `// Test string interpolation in print function

// Test with integer value
print("The value of 10 * 5 is: {}", 10 * 5)

// Test with floating point value
print("Pi is approximately {}", 3.14159)

// Test with variable
let name = "Orus"
print("Hello, {}!", name)

// Test with multiple placeholders
let a = 10
let b = 20
print("The sum of {} and {} is {}", a, b, a + b)

// Test with boolean value
print("Is 10 greater than 5? {}", 10 > 5)

// Test with expression
print("The result of 5 * (3 + 2) is {}", 5 * (3 + 2))

// Test with mixed types
let age = 25
print("{} is {} years old", name, age)

// Test with no placeholders
print("This is a plain string with no interpolation")`,
        
        'string-concat': `print("Hello " + "World")
print("Number: " + 42 + ", pi=" + 3.14)`,
        
        'calculator-struct': `struct Calculator {
    current_value: i32,
    memory: i32,
    operations_count: i32
}

impl Calculator {
    // Static (non-self) factory method
    fn new(initial_value: i32) -> Calculator {
        return Calculator{
            current_value: initial_value,
            memory: 0,
            operations_count: 0
        }
    }
    
    // Static utility methods
    fn add(a: i32, b: i32) -> i32 {
        return a + b
    }
    
    fn subtract(a: i32, b: i32) -> i32 {
        return a - b
    }
    
    fn multiply(a: i32, b: i32) -> i32 {
        return a * b
    }
    
    fn divide(a: i32, b: i32) -> i32 {
        if b == 0 {
            return 0
        }
        return a / b
    }
    
    // Instance (self) methods
    fn add_to_current(self, value: i32) -> i32 {
        self.current_value = self.current_value + value
        self.operations_count = self.operations_count + 1
        return self.current_value
    }
    
    fn subtract_from_current(self, value: i32) -> i32 {
        self.current_value = self.current_value - value
        self.operations_count = self.operations_count + 1
        return self.current_value
    }
    
    fn multiply_current(self, value: i32) -> i32 {
        self.current_value = self.current_value * value
        self.operations_count = self.operations_count + 1
        return self.current_value
    }
    
    fn divide_current(self, value: i32) -> i32 {
        if value != 0 {
            self.current_value = self.current_value / value
            self.operations_count = self.operations_count + 1
        }
        return self.current_value
    }
    
    fn store_in_memory(self) -> i32 {
        self.memory = self.current_value
        return self.memory
    }
    
    fn recall_from_memory(self) -> i32 {
        self.current_value = self.memory
        return self.current_value
    }
    
    fn clear(self) -> i32 {
        self.current_value = 0
        return self.current_value
    }
    
    fn get_operations_count(self) -> i32 {
        return self.operations_count
    }
}

// Test static methods
print("Static add: {}",  Calculator.add(5, 3))
print("Static subtract: {}",  Calculator.subtract(10, 4))
print("Static multiply: {}",  Calculator.multiply(6, 7))
print("Static divide: {}",  Calculator.divide(20, 5))

// Test instance methods with calculator object
let calc: Calculator = Calculator.new(10)
print("Initial value: {}", calc.current_value)

calc.add_to_current(5)
print("After adding 5: {}", calc.current_value)

calc.store_in_memory()
calc.multiply_current(2)
print("After multiplying by 2: {}", calc.current_value)

calc.subtract_from_current(7)
print("After subtracting 7: {}", calc.current_value)

print("Value in memory: {}", calc.memory)
calc.recall_from_memory()
print("After memory recall: {}", calc.current_value)

print("Operations performed: {}", calc.get_operations_count())`,
        
        'composition': `struct Shape {
    x: i32,
    y: i32,
    name: string
}

impl Shape {
    fn new(x: i32, y: i32, name: string) -> Shape {
        return Shape{x: x, y: y, name: name}
    }

    fn move_to(self, new_x: i32, new_y: i32) {
        self.x = new_x
        self.y = new_y
    }

    fn description(self) -> string {
        return self.name + " at (" + self.x + ", " + self.y + ")"
    }
}

struct Rectangle {
    shape: Shape,
    width: i32,
    height: i32
}

impl Rectangle {
    fn new(x: i32, y: i32, width: i32, height: i32) -> Rectangle {
        let shape: Shape = Shape.new(x, y, "Rectangle")
        return Rectangle{shape: shape, width: width, height: height}
    }

    fn area(self) -> i32 {
        return self.width * self.height
    }

    fn description(self) -> string {
        return self.shape.description() + " with width=" + self.width + ", height=" + self.height
    }
}

let rect: Rectangle = Rectangle.new(1, 2, 3, 4)
print(rect.description())
rect.shape.move_to(5,6)
print(rect.description())`,
        
        'student-class': `struct Student {
    name: string,
    id: i32,
    grades: [i32; 5],
}

impl Student {
    fn new(name: string, id: i32) -> Student {
        return Student{
            name: name,
            id: id,
            grades: [0, 0, 0, 0, 0]
        }
    }
    
    fn set_grade(self, index: i32, grade: i32) {
        if index >= 0 and index < 5 {
            self.grades[index] = grade
        }
    }
    
    fn average(self) -> i32 {
        let sum: i32 = 0
        for i in 0..5 {
            sum = sum + self.grades[i]
        }
        return sum / 5
    }
    
    fn highest(self) -> i32 {
        let max: i32 = self.grades[0]
        for i in 1..5 {
            if self.grades[i] > max {
                max = self.grades[i]
            }
        }
        return max
    }
}

struct Class {
    name: string,
    students: [Student; 3],
    count: i32,
}

impl Class {
    fn new(name: string) -> Class {
        let s1: Student = Student.new("", 0)
        let s2: Student = Student.new("", 0)
        let s3: Student = Student.new("", 0)
        
        return Class{
            name: name,
            students: [s1, s2, s3],
            count: 0
        }
    }
    
    fn add_student(self, student: Student) -> bool {
        if self.count < 3 {
            self.students[self.count] = student
            self.count = self.count + 1
            return true
        }
        return false
    }
    
    fn class_average(self) -> i32 {
        if self.count == 0 {
            return 0
        }
        
        let sum: i32 = 0
        for i in 0..self.count {
            sum = sum + self.students[i].average()
        }
        return sum / self.count
    }
}

let alice: Student = Student.new("Alice", 101)
alice.set_grade(0, 85)
alice.set_grade(1, 90)
alice.set_grade(2, 82)
alice.set_grade(3, 88)
alice.set_grade(4, 95)

let bob: Student = Student.new("Bob", 102)
bob.set_grade(0, 75)
bob.set_grade(1, 82)
bob.set_grade(2, 78)
bob.set_grade(3, 80)
bob.set_grade(4, 85)

print("Alice's grades: {}", alice.grades)
print("Alice's average: {}", alice.average())
print("Alice's highest grade: {}", alice.highest())

let math_class: Class = Class.new("Mathematics 101")
math_class.add_student(alice)
math_class.add_student(bob)

print("Class name: {}", math_class.name)
print("Number of students: {}", math_class.count)
print("Class average: {}", math_class.class_average())`
    };

    exampleSelect.addEventListener('change', function() {
        const selectedExample = this.value;
        if (selectedExample && examples[selectedExample]) {
            codeEditor.setValue(examples[selectedExample]);
        }
    });

    // Try example buttons
    const tryExampleButtons = document.querySelectorAll('.try-example');

    tryExampleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const exampleId = this.getAttribute('data-example');

            // Switch to playground section using the navigation function
            navigateToSection('playground');

            // Load the example code
            if (exampleId && examples[exampleId]) {
                codeEditor.setValue(examples[exampleId]);
                exampleSelect.value = exampleId;
            }
        });
    });

    // Real Orus interpreter via backend API
    function executeOrusCode(code) {
        output.textContent = 'Running...';

        // Disable the run button while code is executing
        runButton.disabled = true;
        runButton.textContent = 'Running...';

        fetch('/api/execute', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code: code }),
        })
        .then(response => response.json())
        .then(data => {
            output.textContent = '';

            if (data.output) {
                output.textContent += data.output;
            }

            if (data.error) {
                output.textContent += '\nError: ' + data.error;
            }

            // If there's no output or error, show a message
            if (!data.output && !data.error) {
                output.textContent = 'Program executed successfully with no output.';
            }
        })
        .catch(error => {
            output.textContent = 'Error connecting to the server: ' + error.message;
        })
        .finally(() => {
            // Re-enable the run button
            runButton.disabled = false;
            runButton.textContent = 'Run Code';
        });
    }
});
