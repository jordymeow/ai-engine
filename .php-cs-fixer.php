<?php

$finder = PhpCsFixer\Finder::create()
    ->in( __DIR__ )
    ->exclude( 'vendor' )
    ->exclude( 'node_modules' )
    ->name( '*.php' )
    ->notName( '*.blade.php' )
    ->ignoreDotFiles( true )
    ->ignoreVCS( true );

return ( new PhpCsFixer\Config() )
    ->setRules( [
      '@PSR12' => true,
      'array_syntax' => ['syntax' => 'short'],
      'array_indentation' => true,
      'binary_operator_spaces' => [
        'default' => 'single_space',
      ],
      'blank_line_after_opening_tag' => true,
      'braces_position' => [
        'control_structures_opening_brace' => 'same_line',
        'functions_opening_brace' => 'same_line',
        'anonymous_functions_opening_brace' => 'same_line',
        'classes_opening_brace' => 'same_line',
        'anonymous_classes_opening_brace' => 'same_line',
        'allow_single_line_empty_anonymous_classes' => true,
        'allow_single_line_anonymous_functions' => true,
      ],
      'control_structure_continuation_position' => [
        'position' => 'next_line',
      ],
      'elseif' => false,
      'cast_spaces' => ['space' => 'single'],
      'concat_space' => ['spacing' => 'one'],
      'declare_parentheses' => true,
      'function_typehint_space' => true,
      'method_argument_space' => [
        'on_multiline' => 'ensure_fully_multiline',
        'keep_multiple_spaces_after_comma' => false,
      ],
      'no_extra_blank_lines' => true,
      'no_spaces_around_offset' => false,
      'no_unused_imports' => true,
      'no_whitespace_in_blank_line' => true,
      'single_quote' => true,
      'ternary_operator_spaces' => true,
      'trim_array_spaces' => false,
      'unary_operator_spaces' => true,
      'whitespace_after_comma_in_array' => true,
      'spaces_inside_parentheses' => [
        'space' => 'single'
      ],
      'indentation_type' => true,
    ] )
    ->setIndent( '  ' )
    ->setLineEnding( "\n" );
