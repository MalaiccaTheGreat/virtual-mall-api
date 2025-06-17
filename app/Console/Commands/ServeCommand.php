<?php

namespace App\Console\Commands;

use Illuminate\Foundation\Console\ServeCommand as BaseServeCommand;

class ServeCommand extends BaseServeCommand
{
    /**
     * The console command name.
     *
     * @var string
     */
    protected $name = 'serve';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Serve the application on the PHP development server';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        // Set unlimited execution time
        set_time_limit(0);
        
        return parent::handle();
    }

    /**
     * Get the full process command for the server.
     *
     * @return array
     */
    protected function serverCommand()
    {
        $command = parent::serverCommand();
        
        // Add PHP configuration
        array_splice($command, 1, 0, ['-d', 'max_execution_time=0']);
        
        return $command;
    }
} 